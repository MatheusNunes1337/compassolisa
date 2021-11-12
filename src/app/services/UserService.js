const bcrypt = require('bcryptjs');
const UserRepository = require('../repositories/UserRepository');
const NotFound = require('../errors/NotFound');
const cpfVerification = require('../helpers/user/cpfVerification');
const emailVerification = require('../helpers/user/emailVerification');
const BadRequest = require('../errors/BadRequest');

class UserService {
  async findAll({ offset, limit, ...filter }) {
    
      offset ? parseInt(offset): undefined;
      limit ? parseInt(limit) : undefined;
      
      if(offset < 0 || limit < 0) 
        throw new BadRequest('Limit and offset cannot be negative')
      

    return await UserRepository.getAll(offset, limit, filter);
  }

  async findById(id) {
    const user = await UserRepository.getById(id);
    return user;
  }

  async create(payload) {
    await cpfVerification(payload.cpf)
    await emailVerification(payload.email)
    return await UserRepository.create(payload);
  }

  async update(id, payload) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFound('User');
    }
    const {cpf, email, senha} = payload
    if(cpf) 
      await cpfVerification(cpf)

    if(email) 
      await emailVerification(email)
  
    if(senha) {
      const encriptedPassword = await bcrypt.hash(senha, 10)
      payload.senha = encriptedPassword
    }


    return await UserRepository.update(id, payload);
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
