const CarRepository = require("../repositories/CarRepository")

class CarService {
    async findAll({offset, limit}) {
        return await CarRepository.getAll(offset, limit)
    }

    async findById(id) {
        const car = await CarRepository.getById(id)
        return car
    }
}

module.exports = new CarService()