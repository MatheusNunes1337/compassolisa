const routes = require('express').Router();

const userRouter = require('./user.router');
const carRouter = require('./car.router');
const rentalRouter = require('./rental.router');
const fleetRouter = require('./fleet.router');
const reserveRouter = require('./reserve.router');
const authRouter = require('./auth.router');

routes.use('/api/v1/people', userRouter);
routes.use('/api/v1/car', carRouter);
routes.use('/api/v1/rental', rentalRouter);
routes.use('/api/v1/rental/:rentalId/fleet', fleetRouter);
routes.use('/api/v1/rental/:rentalId/reserve', reserveRouter);
routes.use('/api/v1/authenticate', authRouter);

module.exports = routes;
