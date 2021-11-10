const RentalService = require('../services/RentalService')
const {paginateSerialize, serialize} = require('../serialize/rentalSerialize');

class RentalController {
    async getAll(req, res, next) {
        try {
          const response = await RentalService.getAll(req.query)
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

    async create(req, res, next) {
        try {
            const response = await RentalService.create(req.body)
            return res.status(201).json(serialize(response))
        } catch(err) {
            next(err)
        }
    }

    async update(req, res, next) {
        try {
            const response = await RentalService.update(req.params, req.body)
            return res.status(200).json(serialize(response))
        } catch(err) {
            next(err)
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await RentalService.delete(id)
            return res.status(204).end();
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new RentalController()