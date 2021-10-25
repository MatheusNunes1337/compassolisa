const routes = require('express').Router()

const userRouter = require('./user.router')
const carRouter = require('./car.router')
const authRouter = require('./auth.router')

routes.use('/api/v1/people', userRouter)
routes.use('/api/v1/car', carRouter)
routes.use('/api/v1/authenticate', authRouter)

module.exports = routes