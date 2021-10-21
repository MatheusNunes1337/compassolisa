const UserModel = require('../models/UserModel')

class UserRepository {
    
    async getById(id) {
        return await UserModel.findById(id)
    }

    async create(user) {
        return await UserModel.create(user)
    }

    async delete(id) {
        return await UserModel.findByIdAndDelete(id)
    }

}

module.exports = new UserRepository()