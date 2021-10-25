const CarModel = require('../models/CarModel')

class CarRepository {
    async getAll(offset, limit) {
        return await CarModel.find().skip(offset).limit(limit)
    }

    async getById(id) {
        return await CarModel.findById(id)
    }

    async create(car) {
        return await CarModel.create(car)
    }

    async update(id, carData) {
        const response = await CarModel.findByIdAndUpdate(id, carData, { new: true})
       return response
   }
}

module.exports = new CarRepository()