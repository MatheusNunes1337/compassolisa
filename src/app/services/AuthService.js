const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs')
const AuthRepository = require('../repositories/AuthRepository');
const UserRepository = require('../repositories/UserRepository')
const InvalidCredentials = require('../errors/InvalidCredentials')

dotenv.config();

class AuthService {
  async login(credentials) {
    const {senha} = credentials
    let user = await UserRepository.getByEmail(credentials.email)

    if(!user)
      throw new InvalidCredentials('This email does not exist in database')

    if(!(await bcrypt.compare(senha, user.senha))) 
      throw new InvalidCredentials('The password is incorrect. Try again')

    const { email, habilitado, _id } = user;

    const token = jwt.sign({ email, habilitado }, process.env.API_SECRET, {
      expiresIn: '1d',
    });

    const response = { token };

    return response;
  }
}

module.exports = new AuthService();
