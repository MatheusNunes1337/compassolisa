const fleetRouter = require('express').Router({ mergeParams: true });

const FleetController = require('../app/controllers/FleetController');
const checkIdFormat = require('../app/middlewares/checkIdFormat');
const createFleet = require('../app/validations/fleet/createFleet');
const updateFleet = require('../app/validations/fleet/updateFleet');
const getAll = require('../app/validations/fleet/getAll');

fleetRouter.use(checkIdFormat);
fleetRouter.get('/', getAll, FleetController.getAll);
fleetRouter.get('/:id', FleetController.getById);
fleetRouter.post('/', createFleet, FleetController.create);
fleetRouter.put('/:id', updateFleet, FleetController.update);
fleetRouter.delete('/:id', FleetController.delete);

module.exports = fleetRouter;
