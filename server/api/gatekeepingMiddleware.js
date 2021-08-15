const { models: { User } } = require('../db')

const getUserIfExists = async (req, res, next) => {
  try {
    const token = req.headers.authorization
    const user = !token && await User.findByToken(token)
    req.user = user
    next()
  } catch(e) {
    next(e)
  }
}

const requireToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization
    const user = await User.findByToken(token)
    req.user = user
    next()
  } catch(e) {
    next(e)
  }
}

const isAdmin = (req, res, next) => {
  if (!req.customer.isAdmin) {
    return res.status(403).send('You don\'t belong here. Mind your business!')
  } else {
    next()
  }
}

module.exports = {
  getUserIfExists,
  requireToken,
  isAdmin
}
