const CarModel = require('../models/CarModel')

class CarRepository {
    async getAll(offset, limit) {
        return await CarModel.find().skip(offset).limit(limit)
    }
}

module.exports = new CarRepository()