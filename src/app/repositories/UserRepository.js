const UserModel = require('../models/UserModel')

class UserRepository {
    
    async getById(id) {
        return await UserModel.findById(id)
    }

}

module.exports = new UserRepository()