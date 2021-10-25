const CarModel = require('../models/CarModel')

class CarRepository {
    async getAll(offset, limit) {
        return await CarModel.find().skip(offset).limit(limit)
    }

    async getById(id) {
        return await CarModel.findById(id)
    }
}

module.exports = new CarRepository()