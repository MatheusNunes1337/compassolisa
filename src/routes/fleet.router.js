const fleetRouter = require('express').Router({ mergeParams: true });

const FleetController = require('../app/controllers/FleetController');
const checkIdFormat = require('../app/middlewares/checkIdFormat');
const createFleet = require('../app/validations/fleet/createFleet');
const updateFleet = require('../app/validations/fleet/updateFleet');
const getAll = require('../app/validations/fleet/getAll');

fleetRouter.get('/', checkIdFormat, getAll, FleetController.getAll);
fleetRouter.get('/:id', checkIdFormat, FleetController.getById);
fleetRouter.post('/', checkIdFormat, createFleet, FleetController.create);
fleetRouter.put('/:id', checkIdFormat, updateFleet, FleetController.update);
fleetRouter.delete('/:id', checkIdFormat, FleetController.delete);

module.exports = fleetRouter;
