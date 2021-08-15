const router = require('express').Router()
const { models: { Snippet, User }} = require('../db')
const { requireToken, getUserIfExists } = require('./gatekeepingMiddleware')



router.get('/', async (req, res, next) => {
    try {
        const snippets = await Snippet.findAll({ where: { visibility: 'public' } })
        res.send(snippets)
    } catch (err) {
        next(err)
    }
})

router.get('/:id', getUserIfExists, async (req, res, next) => {
    try {
        const snippet = await Snippet.findByPk(req.params.id, {include: {all: true, nested: true}})
        const user = req.user
        if (snippet.visibility === 'public') {
            res.send(snippet)
        } else {
            const groupids = user && user.groups.map(group => {return group.id})
            if (groupids && groupids.includes(snippet.group.id)) {
                res.send(snippet)
            } else {
                res.send( { id: snippet.id, name: 'This Snippet is Private' } )
            }
        }
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


router.put('/:id', requireToken, async (req, res, next) => {
    try {
        const { name, contentHTML, contentCSS, contentJS } = req.body
        const snippet = await Snippet.findByPk(req.params.id)
        await snippet.update({name, contentHTML, contentJS, contentCSS})
        res.send(snippet)
    } catch (err) {
        next(err)
    }
})


module.exports = router