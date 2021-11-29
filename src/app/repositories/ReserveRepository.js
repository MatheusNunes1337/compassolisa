const ReserveSchema = require('../schemas/ReserveSchema');
const Repository = require('./Repository');

class ReserveRepository extends Repository {
  constructor() {
    super(ReserveSchema);
  }

  async getById(_id, id_locadora) {
    return ReserveSchema.findById({ _id, id_locadora });
  }
}

module.exports = new ReserveRepository();
