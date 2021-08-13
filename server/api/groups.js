const router = require('express').Router()
const { models: { Group, Snippet }} = require('../db')


router.get('/', async (req, res, next) => {
    try {
        const groups = await Group.findAll({
            where: {
                visibility: 'public'
            },
            include: {all: true, nested: true}
        })
        res.send(groups)
    } catch (err) {
        next(err)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const group = await Group.findByPk(req.params.id, {include: Snippet})
        res.send(group)
    } catch (err) {
        next(err)
    }
})



module.exports = router