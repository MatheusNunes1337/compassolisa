const carRouter = require('express').Router()

const checkIdFormat = require('../app/middlewares/checkIdFormat')
const CarController = require('../app/controllers/CarController')


carRouter.get('/', CarController.getAll)
carRouter.get('/:id', checkIdFormat, CarController.getById)
carRouter.post('/', CarController.create)
carRouter.put('/:id', CarController.update)

module.exports = carRouter