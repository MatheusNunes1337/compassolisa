const rentalRouter = require('express').Router();
const RentalController = require('../app/controllers/RentalController');
const checkIdFormat = require('../app/middlewares/checkIdFormat');
const createAndUpdate = require('../app/validations/rental/createAndUpdate');

rentalRouter.get('/', RentalController.getAll);
rentalRouter.get('/:id', checkIdFormat, RentalController.getById);
rentalRouter.post('/', createAndUpdate, RentalController.create);
rentalRouter.put('/:id', createAndUpdate, checkIdFormat, RentalController.update);
rentalRouter.delete('/:id', checkIdFormat, RentalController.delete);

module.exports = rentalRouter;
