const userRouter = require('express').Router();
const UserController = require('../app/controllers/UserController');
const createUser = require('../app/validations/user/createUser');
const updateUser = require('../app/validations/user/updateUser');
const filterValidation = require('../app/validations/user/getAll');
const checkIdFormat = require('../app/middlewares/checkIdFormat');

userRouter.get('/', filterValidation, UserController.getAll);
userRouter.get('/:id', checkIdFormat, UserController.getById);
userRouter.post('/', createUser, UserController.create);
userRouter.put('/:id', checkIdFormat, updateUser, UserController.update);
userRouter.delete('/:id', checkIdFormat, UserController.delete);

module.exports = userRouter;
