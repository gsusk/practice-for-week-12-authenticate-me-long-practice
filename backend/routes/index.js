const router = require('express').Router()
const apiRouter = require('./api')

router.use('/api', apiRouter)

router.get('/api/csrf/restore', (req, res) => {
  const csrfToken = req.csrfToken()
  res.cookie('XSRF-TOKEN', csrfToken)
  res.status(200).json({ 'XSRF-TOKEN': csrfToken })
})

module.exports = router
