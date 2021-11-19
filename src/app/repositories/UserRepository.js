const UserSchema = require('../schemas/UserSchema');
const Repository = require('./Repository');

class UserRepository extends Repository {
  constructor() {
    super(UserSchema);
  }

  async getByEmail(email) {
    return UserSchema.findOne({ email });
  }
}

module.exports = new UserRepository();
