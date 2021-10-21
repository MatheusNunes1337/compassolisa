const UserRepository = require('../repositories/UserRepository')
const NotFound = require('../errors/NotFound')

class UserService {
    async findAll() {
        return await UserRepository.getAll()
    }

    async findById(id) {
        const user = await UserRepository.getById(id)
        return user
    }

    async create(user) {
        return await UserRepository.create(user)
    }

    async update(id, userData) {
        return await UserRepository.update(id, userData)
    }

    async delete(id) {
        return await UserRepository.delete(id)
    }
}

module.exports = new UserService()