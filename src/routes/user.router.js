const userRouter = require('express').Router()
const UserController = require('../app/controllers/UserController')

userRouter.get('/:id', UserController.getById)

module.exports = userRouter