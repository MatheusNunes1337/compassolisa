const carRouter = require('express').Router();

const CarController = require('../app/controllers/CarController');
const checkIdFormat = require('../app/middlewares/checkIdFormat');
const bodyValidation = require('../app/validations/car/createAndUpdate');
const accessoryValidation = require('../app/validations/car/accessoryValidation');
const userAuthentication = require('../app/middlewares/userAuthentication');

carRouter.use(userAuthentication);
carRouter.get('/', CarController.getAll);
carRouter.get('/:id', checkIdFormat, CarController.getById);
carRouter.post('/', bodyValidation, CarController.create);
carRouter.put('/:id', checkIdFormat, bodyValidation, CarController.update);
carRouter.patch('/:id/acessorios/:accessoryId', checkIdFormat, accessoryValidation, CarController.updateAccessory);
carRouter.delete('/:id', checkIdFormat, CarController.delete);

module.exports = carRouter;
