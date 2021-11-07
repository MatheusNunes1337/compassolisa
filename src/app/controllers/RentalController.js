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
}

module.exports = new RentalController()