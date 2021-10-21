const UserModel = require('../models/UserModel')

class UserRepository {
    
    async getById(id) {
        return await UserModel.findById(id)
    }

    async create(user) {
        return await UserModel.create(user)
    }

}

module.exports = new UserRepository()