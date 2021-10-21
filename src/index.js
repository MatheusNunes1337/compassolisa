const express = require('express')

const errorHandler = require('./app/middlewares/errorHandler')
const dbConnection = require('./infra/database')

dbConnection.connect()

class App {
    constructor() {
        this.express = express()
        this.middlewares()
        this.errors()
    }

    middlewares() {
        this.express.use(express.json())
    }

    errors() {
        this.express.use(errorHandler)
    }

}

module.exports = new App().express