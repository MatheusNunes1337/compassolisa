const routes = require('express').Router()

const userRouter = require('./user.router')

routes.use('/api/v1/people', userRouter)

module.exports = routes