const UserModel = require('../models/UserModel');

class UserRepository {
  async getAll(filter, offset = 0, limit = 100) {
    Number(offset);
    Number(limit);

    return UserModel.paginate(filter, { offset, limit });
  }

  async getById(id) {
    return UserModel.findById(id);
  }

  async getByEmail(email) {
    return UserModel.findOne({ email });
  }

  async create(user) {
    return UserModel.create(user);
  }

  async update(id, userData) {
    const response = await UserModel.findByIdAndUpdate(id, userData, { new: true });
    return response;
  }

  async delete(id) {
    return UserModel.findByIdAndDelete(id);
  }
}

module.exports = new UserRepository();
