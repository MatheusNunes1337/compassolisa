const UserRepository = require('../repositories/UserRepository')
const NotFound = require('../errors/NotFound')

class UserService {
    async findById(id) {
        const user = await UserRepository.getById(id)
        if(!user) {
            throw new NotFound('User')
        }
        return user
    }

    async create(user) {
        return await UserRepository.create(user)
    }

    async delete(id) {
        return await UserRepository.delete(id)
    }
}

module.exports = new UserService()