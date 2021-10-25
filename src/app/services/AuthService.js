const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const AuthRepository = require('../repositories/AuthRepository')

dotenv.config()


class AuthService {
    async login(credentials) {
        const user = await AuthRepository.login(credentials)
        if(!user) {
            throw new Error('Email or password is incorrent. Try Again')
        }

        const {email, habilitado, _id} = user

        const token = jwt.sign({id: _id}, process.env.API_SECRET, {
            expiresIn: '1d'
        })

        return {token, email, habilitado}
    }
} 

module.exports = new AuthService()