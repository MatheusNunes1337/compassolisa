const FleetSchema = require('../schemas/FleetSchema');
const Repository = require('./Repository');

class FleetRepository extends Repository {
  constructor() {
    super(FleetSchema);
  }

  async getById(id, rentalId) {
    return this.schema.findOne({ id, id_locadora: rentalId });
  }
}

module.exports = new FleetRepository();
