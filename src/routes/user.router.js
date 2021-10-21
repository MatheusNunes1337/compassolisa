const userRouter = require('express').Router()
const UserController = require('../app/controllers/UserController')

userRouter.get('/', UserController.getAll)
userRouter.get('/:id', UserController.getById)
userRouter.post('/', UserController.create)
userRouter.put('/:id', UserController.update)
userRouter.delete('/:id', UserController.delete)

module.exports = userRouter