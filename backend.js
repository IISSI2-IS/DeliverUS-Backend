const express = require('express')
const cors = require('cors')
require('dotenv').config()
const path = require('path')
const helmet = require('helmet')

const app = express()
app.use(express.json()) // parser de requests body como json
app.use(cors()) // habilita peticiones desde otro dominio
app.use(helmet()) // seguridad general en servicios REST

const passport = require('passport')
const BearerStrategy = require('passport-http-bearer').Strategy

const UserController = require('./controllers/UserController')
app.use('/public', express.static(path.join(__dirname, '/public')))// Serves resources from public folder
const { Sequelize } = require('sequelize')

passport.use(new BearerStrategy(
  async function (token, done) {
    try {
      const user = await UserController.findByToken(token)
      return done(null, user, { scope: 'all' })
    } catch (err) {
      console.log('BearerStrategy')
      return done(null, false, { message: err.message })
    }
  }
))

// require only admits one parameter, so we need to create an object composed of both parameters needed on routes
const requireOptions = { app: app }
require('./routes/')(requireOptions)

const databaseHost = process.env.DATABASE_HOST
const databasePort = process.env.DATABASE_PORT
const databaseUsername = process.env.DATABASE_USERNAME
const databasePassword = process.env.DATABASE_PASSWORD
const databaseName = process.env.DATABASE_NAME

const sequelize = new Sequelize(databaseName, databaseUsername, databasePassword, {
  host: databaseHost,
  port: databasePort,
  dialect: 'mariadb'
  // logging: false
})

console.log('Va a conectar')
sequelize.authenticate()
  .then(() => {
    console.info('INFO - Database connected.')
    const port = process.env.APP_PORT || 3000
    return app.listen(port)
  })
  .then((server) => {
    console.log('Deliverus listening at http://localhost:' + server.address().port)
  })
  .catch(err => {
    console.error('ERROR - Unable to connect to the database:', err)
  })
