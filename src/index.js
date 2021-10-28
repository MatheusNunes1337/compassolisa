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
    this.swagger();
    this.routes();
    this.errors();
  }

  middlewares() {
    this.express.use(express.json());
  }

  routes() {
    this.express.use(routes);
  }

  errors() {
    this.express.use(errorHandler);
  }

  swagger() {
    this.express.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
  }
}

module.exports = new App().express;
