const reserveRouter = require('express').Router({ mergeParams: true });

const ReserveController = require('../app/controllers/ReserveController');
const checkIdFormat = require('../app/middlewares/checkIdFormat');
const userAuthentication = require('../app/middlewares/userAuthentication');

reserveRouter.use(userAuthentication);
reserveRouter.get('/', checkIdFormat, ReserveController.getAll);
reserveRouter.get('/:id', checkIdFormat, ReserveController.getById);
reserveRouter.post('/', checkIdFormat, ReserveController.create);

module.exports = reserveRouter;
