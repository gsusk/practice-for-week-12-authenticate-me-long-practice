const router = require('express').Router()

router.get('/hello/world', (req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken())
  res.send('Hello World!')
})

module.exports = router
