const rentalRouter = require('express').Router();
const RentalController = require('../app/controllers/RentalController');
const checkIdFormat = require('../app/middlewares/checkIdFormat');
const bodyValidation = require('../app/validations/rental/createAndUpdate');
const filterValidation = require('../app/validations/rental/getAll');

rentalRouter.get('/', filterValidation, RentalController.getAll);
rentalRouter.get('/:id', checkIdFormat, RentalController.getById);
rentalRouter.post('/', bodyValidation, RentalController.create);
rentalRouter.put('/:id', checkIdFormat, bodyValidation, RentalController.update);
rentalRouter.delete('/:id', checkIdFormat, RentalController.delete);

module.exports = rentalRouter;
