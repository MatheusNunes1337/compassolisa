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
}

module.exports = new FleetController();
