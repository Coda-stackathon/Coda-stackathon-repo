const router = require('express').Router()
const { models: { Snippet }} = require('../db')



router.get('/', async (req, res, next) => {
    try {
        const snippets = await Snippet.findAll({ where: { visibility: 'public' } })
        res.json(snippets)
    } catch (err) {
        next(err)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const snippet = await Snippet.findByPk(req.params.id)
        res.send(snippet)
    } catch (err) {
        next(err)
    }
})

module.exports = router