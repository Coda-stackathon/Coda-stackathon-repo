const router = require('express').Router()
const { models: { Group, Snippet }} = require('../db')



router.get('/:id', async (req, res, next) => {
    try {
        const group = await Group.findByPk(req.params.id, {include: Snippet})
        res.send(group)
    } catch (err) {
        next(err)
    }
})



module.exports = router