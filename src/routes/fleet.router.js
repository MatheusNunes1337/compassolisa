const fleetRouter = require('express').Router({ mergeParams: true });

const FleetController = require('../app/controllers/FleetController');
const checkIdFormat = require('../app/middlewares/checkIdFormat');

fleetRouter.use(checkIdFormat);
fleetRouter.get('/', FleetController.getAll);
fleetRouter.get('/:id', FleetController.getById);
fleetRouter.post('/', FleetController.create);
fleetRouter.put('/:id', FleetController.update);
fleetRouter.delete('/:id', FleetController.delete);

module.exports = fleetRouter;
