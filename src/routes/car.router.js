const carRouter = require('express').Router();

const CarController = require('../app/controllers/CarController');
const checkIdFormat = require('../app/middlewares/checkIdFormat');
const carValidation = require('../app/validations/car/carValidation');
const accessoryValidation = require('../app/validations/car/accessoryValidation');
const userAuthentication = require('../app/middlewares/userAuthentication');

carRouter.use(userAuthentication);
carRouter.get('/', CarController.getAll);
carRouter.get('/:id', checkIdFormat, CarController.getById);
carRouter.post('/', carValidation, CarController.create);
carRouter.put('/:id', checkIdFormat, carValidation, CarController.update);
carRouter.patch('/:id/acessorios/:accessoryId', checkIdFormat, accessoryValidation, CarController.updateAccessory);
carRouter.delete('/:id', checkIdFormat, CarController.delete);

module.exports = carRouter;
