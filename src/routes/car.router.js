const carRouter = require('express').Router();

const CarController = require('../app/controllers/CarController');
const checkIdFormat = require('../app/middlewares/checkIdFormat');
const createCar = require('../app/validations/car/createCar');
const updateCar = require('../app/validations/car/updateCar');
const filterValidation = require('../app/validations/car/getAll');
const accessoryValidation = require('../app/validations/car/accessoryValidation');
const userAuthentication = require('../app/middlewares/userAuthentication');

carRouter.use(userAuthentication);
carRouter.get('/', filterValidation, CarController.getAll);
carRouter.get('/:id', checkIdFormat, CarController.getById);
carRouter.post('/', createCar, CarController.create);
carRouter.put('/:id', checkIdFormat, updateCar, CarController.update);
carRouter.patch('/:id/acessorios/:accessoryId', checkIdFormat, accessoryValidation, CarController.updateAccessory);
carRouter.delete('/:id', checkIdFormat, CarController.delete);

module.exports = carRouter;
