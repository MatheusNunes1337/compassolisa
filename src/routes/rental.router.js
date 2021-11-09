const rentalRouter = require('express').Router();
const RentalController = require('../app/controllers/RentalController');
const checkIdFormat = require('../app/middlewares/checkIdFormat');

rentalRouter.get('/', RentalController.getAll);
rentalRouter.get('/:id', checkIdFormat, RentalController.getById);
rentalRouter.post('/', RentalController.create);
rentalRouter.put('/:id', checkIdFormat, RentalController.update);
rentalRouter.delete('/:id', checkIdFormat, RentalController.delete);

module.exports = rentalRouter;
