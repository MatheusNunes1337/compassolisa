const carRouter = require('express').Router();

const CarController = require('../app/controllers/CarController');
const checkIdFormat = require('../app/middlewares/checkIdFormat');
const carValidation = require('../app/validations/carValidation');
const userAuthentication = require('../app/middlewares/userAuthentication');

carRouter.use(userAuthentication);
carRouter.get('/', CarController.getAll);
carRouter.get('/:id', checkIdFormat, CarController.getById);
carRouter.post('/', carValidation, CarController.create);
carRouter.put('/:id', checkIdFormat, carValidation, CarController.update);
carRouter.delete('/:id', checkIdFormat, CarController.delete);

module.exports = carRouter;
