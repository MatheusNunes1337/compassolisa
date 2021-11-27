const ReserveSchema = require('../schemas/ReserveSchema');
const Repository = require('./Repository');

class ReserveRepository extends Repository {
  constructor() {
    super(ReserveSchema);
  }

  async getById(_id, id_locadora) {
    return ReserveSchema.findById({ _id, id_locadora });
  }

  async delete(_id, id_locadora) {
    return ReserveSchema.findByIdAndDelete({ _id, id_locadora });
  }
}

module.exports = new ReserveRepository();
