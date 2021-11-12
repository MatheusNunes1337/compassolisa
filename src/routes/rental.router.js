const rentalRouter = require('express').Router();
const RentalController = require('../app/controllers/RentalController');
const checkIdFormat = require('../app/middlewares/checkIdFormat');
const createRental = require('../app/validations/rental/createRental');
const updateRental = require('../app/validations/rental/updateRental');
const filterValidation = require('../app/validations/rental/getAll');

rentalRouter.get('/', filterValidation, RentalController.getAll);
rentalRouter.get('/:id', checkIdFormat, RentalController.getById);
rentalRouter.post('/', createRental, RentalController.create);
rentalRouter.put('/:id', checkIdFormat, updateRental, RentalController.update);
rentalRouter.delete('/:id', checkIdFormat, RentalController.delete);

module.exports = rentalRouter;
