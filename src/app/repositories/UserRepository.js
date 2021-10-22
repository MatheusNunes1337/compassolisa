const UserModel = require('../models/UserModel')

class UserRepository {
    async getAll() {
        return await UserModel.find()
    }

    async getByFilter(offset, limit, filter) {
        return await UserModel.find(filter).skip(offset).limit(limit)
    }
    
    async getById(id) {
        return await UserModel.findById(id)
    }

    async create(user) {
        return await UserModel.create(user)
    }

    async update(id, userData) {
        const response = await UserModel.findByIdAndUpdate(id, userData, { new: true})
        return response
    }

    async delete(id) {
        return await UserModel.findByIdAndDelete(id)
    }

}

module.exports = new UserRepository()