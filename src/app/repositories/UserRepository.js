const UserModel = require('../models/UserModel')

class UserRepository {
    async getAll(offset, limit) {
        const total = await UserModel.find().countDocuments()
        const pessoas = await UserModel.find().skip(offset).limit(limit)
        const offsets = pessoas.length
        return {pessoas, total, offsets}
    }

    async getByFilter(offset, limit, filter) {
        const total = await UserModel.find(filter).countDocuments()
        const pessoas = await UserModel.find(filter).skip(offset).limit(limit)
        const offsets = pessoas.length
        return {pessoas, total, offsets}
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