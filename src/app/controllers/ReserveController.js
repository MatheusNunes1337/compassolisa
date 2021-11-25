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
}

module.exports = new ReserveController();
