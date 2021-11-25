const ReserveSchema = require('../schemas/ReserveSchema');
const Repository = require('./Repository');

class ReserveRepository extends Repository {
  constructor() {
    super(ReserveSchema);
  }
}

module.exports = new ReserveRepository();
