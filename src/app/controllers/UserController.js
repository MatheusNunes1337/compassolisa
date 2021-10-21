const UserService = require('../services/UserService')

class UserController {
    async getById(req, res, next) {
        try {
            const { id } = req.params 
            const user = await UserService.findById(id)
            return res.status(200).json(user)
        } catch(err) {
            next(err)
        }
    }

    async create(req, res, next) {
        try {
            const user = await UserService.create(req.body)
            user.senha = undefined
            return res.status(201).json(user)
        } catch(err) {
            next(err)
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params
            await UserService.findById(id)
            await UserService.update(id, req.body)
        } catch(err) {
            next(err)
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params
            await UserService.findById(id)
            await UserService.delete(id)
            return res.status(204).end()
        } catch(err) {
            next(err)
        }
    }
}

module.exports = new UserController()