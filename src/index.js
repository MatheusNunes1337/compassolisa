const express = require('express');

const routes = require('./routes');
const errorHandler = require('./app/middlewares/errorHandler');
const dbConnection = require('./infra/database');

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
  }

  routes() {
    this.express.use(routes);
  }

  errors() {
    this.express.use(errorHandler);
  }
}

module.exports = new App().express;
