const UserSchema = require('../schemas/UserSchema');

class UserRepository {
  async getAll(filter, offset = 0, limit = 100) {
    Number(offset);
    Number(limit);

    return UserSchema.paginate(filter, { offset, limit });
  }

  async getById(id) {
    return UserSchema.findById(id);
  }

  async getByEmail(email) {
    return UserSchema.findOne({ email });
  }

  async create(user) {
    return UserSchema.create(user);
  }

  async update(id, userData) {
    return UserSchema.findByIdAndUpdate(id, userData, { new: true });
  }

  async delete(id) {
    return UserSchema.findByIdAndDelete(id);
  }
}

module.exports = new UserRepository();
