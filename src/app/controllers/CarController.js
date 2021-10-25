const CarService = require('../services/CarService')

class CarController {
    async getAll(req, res, next) {
        try {
            let cars
        
            req.query.offset = parseInt(req.query.offset)
            req.query.limit = parseInt(req.query.limit)
        
            if(Object.keys(req.query).length == 2) {
                cars = await CarService.findAll(req.query)
            }
            /*    
            else {
                cars = await UserService.findAll(req.query)
            }
            */
            return res.status(200).json(cars)
        } catch(err) {
            next(err)
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params 
            const car = await CarService.findById(id)
            if(car)
                return res.status(200).json(car)
            else 
                return res.status(204).end()    
        } catch(err) {
            next(err)
        }
    }

    async create(req, res, next) {
        try {
            const car = await CarService.create(req.body)
            return res.status(201).json(car)
        } catch(err) {
            next(err)
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params
            const response = await CarService.update(id, req.body)
            return res.status(200).json(response)
        } catch(err) {
            next(err)
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params
            await CarService.delete(id)
            return res.status(204).end()
        } catch(err) {
            next(err)
        }
    }
}

module.exports = new CarController()