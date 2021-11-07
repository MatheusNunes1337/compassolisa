const rentalRouter = require('express').Router();
const RentalController = require('../app/controllers/RentalController');

rentalRouter.get('/', RentalController.getAll);

module.exports = rentalRouter;
