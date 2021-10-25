const CarRepository = require("../repositories/CarRepository")

class CarService {
    async findAll({offset, limit}) {
        return await CarRepository.getAll(offset, limit)
    }
}

module.exports = new CarService()