const UserService = require('../services/UserService')

class UserController {
    async getAll(req, res, next) {
        try {
            const users = await UserService.findAll()
            users.map(user => user.senha = undefined)
            return res.status(200).json(users)
        } catch(err) {
            next(err)
        }
    }


    async getById(req, res, next) {
        try {
            const { id } = req.params 
            const user = await UserService.findById(id)
            if(user)
                return res.status(200).json(user)
            else 
            return res.status(204).end()    
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
            const result = await UserService.update(id, req.body)
            result.senha = undefined
            return res.status(200).json(result)
        } catch(err) {
            next(err)
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params
            await UserService.delete(id)
            return res.status(204).end()
        } catch(err) {
            next(err)
        }
    }
}

module.exports = new UserController()