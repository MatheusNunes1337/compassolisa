const UserModel = require('../models/UserModel')

class UserRepository {
    async getAll() {
        return await UserModel.find()
    }
    
    async getById(id) {
        return await UserModel.findById(id)
    }

    async create(user) {
        return await UserModel.create(user)
    }

    async update(id, userData) {
        await UserModel.findByIdAndUpdate(id, userData, { new: true})
    }

    async delete(id) {
        return await UserModel.findByIdAndDelete(id)
    }

}

module.exports = new UserRepository()