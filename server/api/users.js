const router = require('express').Router()
const { models: { User, Group, Snippet }} = require('../db')
const { requireToken, isAdmin } = require('./gatekeepingMiddleware')
module.exports = router

router.get('/', requireToken, isAdmin, async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and username fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'username']
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})


router.get('./:id', requireToken, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {include: {all: true, nested: true}})
    res.json(user)
  } catch (err) {
    next(err)
  }
})

router.get('./:id/snippets', requireToken, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {include: {all: true, nested: true} })
    const snippets = await user.getGroups().getSnippets()
    res.json(snippets)
  } catch (err) {
    next(err)
  }
})

