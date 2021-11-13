const bcrypt = require('bcryptjs');
const UserRepository = require('../repositories/UserRepository');
const NotFound = require('../errors/NotFound');
const cpfVerification = require('../helpers/user/cpfVerification');
const emailVerification = require('../helpers/user/emailVerification');
const BadRequest = require('../errors/BadRequest');

class UserService {
  async findAll({ offset, limit, ...filter }) {
    if (offset) {
      Number(offset);
    }
    if (limit) {
      Number(limit);
    }

    if (offset < 0 || limit < 0) throw new BadRequest('Limit and offset cannot be negative');

    return UserRepository.getAll(filter, offset, limit);
  }

  async findById(id) {
    const user = await UserRepository.getById(id);
    return user;
  }

  async create(payload) {
    await cpfVerification(payload.cpf);
    await emailVerification(payload.email);
    return UserRepository.create(payload);
  }

  async update(id, payload) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFound('User');
    }
    const { cpf, email, senha } = payload;
    if (cpf) await cpfVerification(cpf);

    if (email) await emailVerification(email);

    if (senha) {
      const encriptedPassword = await bcrypt.hash(senha, 10);
      payload.senha = encriptedPassword;
    }

    return UserRepository.update(id, payload);
  }

  async delete(id) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFound('User');
    }
    return UserRepository.delete(id);
  }
}

module.exports = new UserService();
