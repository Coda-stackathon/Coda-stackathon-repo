const router = require('express').Router()
const { models: { Snippet, User }} = require('../db')
const { requireToken } = require('./gatekeepingMiddleware')



router.get('/', async (req, res, next) => {
    try {
        const snippets = await Snippet.findAll({ where: { visibility: 'public' } })
        res.send(snippets)
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

router.post('/', requireToken, async (req, res, next) => {
    try {
        const { name, contentHTML, contentCSS, contentJS, group } = req.body
        const user = req.user
        const groups = await user.getGroups({where: {id: group}});
        const snippet = await Snippet.create({name, contentHTML, contentJS, contentCSS})
        await groups[0].addSnippet(snippet)
        res.send(snippet)
    } catch (err) {
        next(err)
    }
})

module.exports = router