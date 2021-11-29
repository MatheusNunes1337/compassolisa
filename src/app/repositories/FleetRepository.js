const FleetSchema = require('../schemas/FleetSchema');
const Repository = require('./Repository');

class FleetRepository extends Repository {
  constructor() {
    super(FleetSchema);
  }

  async getById(_id, id_locadora) {
    return FleetSchema.findById({ _id, id_locadora });
  }
}

module.exports = new FleetRepository();
