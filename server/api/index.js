const router = require('express').Router()
module.exports = router

router.use('/users', require('./users'))
router.use('/groups', require('./groups'))
router.use('/snippets', require('./snippets'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
