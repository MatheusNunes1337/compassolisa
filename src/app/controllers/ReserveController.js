const ReserveService = require('../services/ReserveService');
const { paginateSerialize, serialize } = require('../serialize/reserveSerialize');

class ReserveController {
  async getAll(req, res, next) {
    try {
      const response = await ReserveService.getAll(req.query, req.params);
      return res.status(200).json(paginateSerialize(response));
    } catch (err) {
      return next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const reserve = await ReserveService.getById(req.params);
      if (reserve) return res.status(200).json(serialize(reserve));
      return res.status(204).end();
    } catch (err) {
      return next(err);
    }
  }

  async create(req, res, next) {
    try {
      const reserve = await ReserveService.create(req.userId, req.userStatus, req.params, req.body);
      return res.status(201).json(serialize(reserve));
    } catch (err) {
      return next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await ReserveService.delete(req.params);
      return res.status(204).end();
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new ReserveController();
