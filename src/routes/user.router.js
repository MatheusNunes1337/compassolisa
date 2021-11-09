const userRouter = require('express').Router();
const UserController = require('../app/controllers/UserController');
const bodyValidation = require('../app/validations/user/createAndUpdate');
const checkIdFormat = require('../app/middlewares/checkIdFormat');

userRouter.get('/', UserController.getAll);
userRouter.get('/:id', checkIdFormat, UserController.getById);
userRouter.post('/', bodyValidation, UserController.create);
userRouter.put('/:id', checkIdFormat, bodyValidation, UserController.update);
userRouter.delete('/:id', checkIdFormat, UserController.delete);

module.exports = userRouter;
