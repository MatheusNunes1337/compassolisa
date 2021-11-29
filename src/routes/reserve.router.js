const reserveRouter = require('express').Router({ mergeParams: true });

const ReserveController = require('../app/controllers/ReserveController');
const checkIdFormat = require('../app/middlewares/checkIdFormat');
const createReserve = require('../app/validations/reserve/createReserve');
const updateReserve = require('../app/validations/reserve/updateReserve');
const getReserve = require('../app/validations/reserve/getReserve');
const userAuthentication = require('../app/middlewares/userAuthentication');

reserveRouter.use(userAuthentication);
reserveRouter.get('/', checkIdFormat, getReserve, ReserveController.getAll);
reserveRouter.get('/:id', checkIdFormat, ReserveController.getById);
reserveRouter.post('/', checkIdFormat, createReserve, ReserveController.create);
reserveRouter.put('/:id', checkIdFormat, updateReserve, ReserveController.update);
reserveRouter.delete('/:id', checkIdFormat, ReserveController.delete);

module.exports = reserveRouter;
