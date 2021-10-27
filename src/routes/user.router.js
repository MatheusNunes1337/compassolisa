const userRouter = require('express').Router()
const UserController = require('../app/controllers/UserController')
const userValidation = require('../app/validations/userValidation')
const checkIdFormat = require('../app/middlewares/checkIdFormat')

userRouter.get('/', UserController.getAll)
userRouter.get('/:id', checkIdFormat, UserController.getById)
userRouter.post('/', userValidation, UserController.create)
userRouter.put('/:id', checkIdFormat, userValidation, UserController.update)
userRouter.delete('/:id', checkIdFormat, UserController.delete)

module.exports = userRouter