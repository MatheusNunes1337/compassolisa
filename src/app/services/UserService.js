const UserRepository = require('../repositories/UserRepository');
const NotFound = require('../errors/NotFound');
const cpfVerification = require('../validations/cpfVerification')
const emailVerification = require('../validations/emailVerification')
const BadRequest = require('../errors/BadRequest')

class UserService {
  async findAll({ offset, limit, ...filter }) {
    if(!offset && !limit) {
       offset = 1
       limit = 100
    } else {
      offset = parseInt(offset);
      limit = parseInt(limit);
      
      if(offset < 0 || limit < 0) 
        throw new BadRequest('Limit and offset cannot have nagative values')
    }

    return await UserRepository.getAll(offset, limit, filter);
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
