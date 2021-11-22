const fleetRouter = require('express').Router({ mergeParams: true });

const FleetController = require('../app/controllers/FleetController');
const checkIdFormat = require('../app/middlewares/checkIdFormat');

fleetRouter.get('/', checkIdFormat, FleetController.getAll);

module.exports = fleetRouter;
