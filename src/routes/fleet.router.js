const fleetRouter = require('express').Router({ mergeParams: true });

const FleetController = require('../app/controllers/FleetController');
const checkIdFormat = require('../app/middlewares/checkIdFormat');

fleetRouter.get('/', checkIdFormat, FleetController.getAll);
fleetRouter.get('/:id', checkIdFormat, FleetController.getById);
fleetRouter.post('/', checkIdFormat, FleetController.create);

module.exports = fleetRouter;
