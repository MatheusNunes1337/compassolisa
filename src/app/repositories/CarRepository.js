const CarModel = require('../models/CarModel')

class CarRepository {
    async getAll(offset, limit) {
        return await CarModel.find().skip(offset).limit(limit)
    }

    async getByFilter(offset, limit, filter) {
        const total = await CarModel.find(filter).countDocuments()
        const veiculos = await CarModel.find(filter).skip(offset).limit(limit)
        const offsets = veiculos.length
        return { veiculos, total, offsets}
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

    async delete(id) {
        return await CarModel.findByIdAndDelete(id)
    }
}

module.exports = new CarRepository()