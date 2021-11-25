const reserveRouter = require('express').Router({ mergeParams: true });

const ReserveController = require('../app/controllers/ReserveController');
const checkIdFormat = require('../app/middlewares/checkIdFormat');

reserveRouter.get('/', checkIdFormat, ReserveController.getAll);

module.exports = reserveRouter;
