const authRouter = require('express').Router();
const AuthController = require('../app/controllers/AuthController');

authRouter.post('/', AuthController.login);

module.exports = authRouter;
