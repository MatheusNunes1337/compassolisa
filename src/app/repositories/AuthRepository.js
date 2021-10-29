const UserModel = require('../models/UserModel');

class AuthRepository {
  async login(credentials) {
    return await UserModel.findOne(credentials);
  }
}

module.exports = new AuthRepository();
