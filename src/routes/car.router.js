const carRouter = require('express').Router()

const CarController = require('../app/controllers/CarController')
const checkIdFormat = require('../app/middlewares/checkIdFormat')
const carValidation = require('../app/validations/carValidation')

carRouter.get('/', CarController.getAll)
carRouter.get('/:id', checkIdFormat, CarController.getById)
carRouter.post('/', carValidation, CarController.create)
carRouter.put('/:id', carValidation, CarController.update)
carRouter.delete('/:id', CarController.delete)

module.exports = carRouter