const UserRepository = require('../repositories/UserRepository');
const NotFound = require('../errors/NotFound');
const cpfVerification = require('../validations/cpfVerification')
const emailVerification = require('../validations/emailVerification')

class UserService {
  async findAll({ offset, limit, ...filter }) {
    const result = await UserRepository.getAll(offset, limit, filter);
    const { docs, totalDocs } = result

    const response = {}
    response.pessoas = docs
    response.total = totalDocs
    response.limit = limit
    response.offset = offset
    response.offsets = docs.length

    return response
  }

  async findById(id) {
    const user = await UserRepository.getById(id);
    return user;
  }

  async create(user) {
    await cpfVerification(user.cpf)
    await emailVerification(user.email)
    return await UserRepository.create(user);
  }

  async update(id, userData) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFound('User');
    }
    return await UserRepository.update(id, userData);
  }

  async delete(id) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFound('User');
    }
    return await UserRepository.delete(id);
  }
}

module.exports = new UserService();
