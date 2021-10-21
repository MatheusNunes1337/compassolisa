const express = require('express')

const dbConnection = require('./infra/database')
dbConnection.connect()

class App {
    constructor() {
        this.express = express()
        this.middlewares()
    }

    middlewares() {
        this.express.use(express.json())
    }

}

module.exports = new App().express