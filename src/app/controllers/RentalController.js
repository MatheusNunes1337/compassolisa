const RentalService = require('../services/RentalService')
const {paginateSerialize, serialize} = require('../serialize/rentalSerialize')

class RentalController {
    async getAll(req, res, next) {
        try {
          const response = await RentalService.getAll(req.body)
          return res.status(200).json(paginateSerialize(response));
        } catch (err) {
          next(err);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const rental = await RentalService.getById(id)
            if (rental) return res.status(200).json(serialize(rental));
            return res.status(204).end();
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new RentalController()