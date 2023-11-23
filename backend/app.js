const express = require('express')
require('express-async-errors')
const morgan = require('morgan')
const cors = require('cors')
const csurf = require('csurf')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const { environment } = require('./config')
const testRoute = require('./routes/index.js')

const isProduction = environment === 'production'

const app = express()

if (!isProduction) {
  app.use(cors())
}
app.use(morgan('dev'))
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(cookieParser())
app.use(express.json())
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && 'Lax',
      httpOnly: true,
    },
  }),
)

app.use('/', testRoute)

module.exports = app
