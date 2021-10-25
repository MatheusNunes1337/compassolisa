const carRouter = require('express').Router()
const CarController = require('../app/controllers/CarController')

carRouter.get('/', CarController.getAll)

module.exports = carRouter