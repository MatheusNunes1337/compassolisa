const rentalRouter = require('express').Router();
const RentalController = require('../app/controllers/RentalController');
const checkIdFormat = require('../app/middlewares/checkIdFormat');

rentalRouter.get('/', RentalController.getAll);
rentalRouter.get('/:id', checkIdFormat, RentalController.getById);
rentalRouter.delete('/:id', checkIdFormat, RentalController.delete);

module.exports = rentalRouter;
