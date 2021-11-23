const FleetService = require('../services/FleetService');
const { serialize, paginateSerialize } = require('../serialize/fleetSerialize');

class FleetController {
  async getAll(req, res, next) {
    try {
      const response = await FleetService.getAll(req.query, req.params);
      return res.status(200).json(paginateSerialize(response));
    } catch (err) {
      return next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const fleet = await FleetService.getById(req.params);
      if (fleet) return res.status(200).json(serialize(fleet));
      return res.status(204).end();
    } catch (err) {
      return next(err);
    }
  }

  async create(req, res, next) {
    try {
      const fleet = await FleetService.create(req.body, req.params);
      return res.status(201).json(serialize(fleet));
    } catch (err) {
      return next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await FleetService.delete(req.params);
      return res.status(204).end();
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new FleetController();
