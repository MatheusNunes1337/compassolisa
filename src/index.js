const express = require('express');
const swaggerUI = require('swagger-ui-express');

const routes = require('./routes');
const errorHandler = require('./app/middlewares/errorHandler');
const dbConnection = require('./infra/database');
const swaggerDocs = require('./swagger.json');

dbConnection.connect();

class App {
  constructor() {
    this.express = express();
    this.middlewares();
    this.routes();
    this.errors();
  }

  middlewares() {
    this.express.use(express.json());
    this.express.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
  }

  routes() {
    this.express.use(routes);
  }

  errors() {
    this.express.use(errorHandler);
  }
}

module.exports = new App().express;
