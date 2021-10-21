const UserService = require('../services/UserService')

class UserController {
    async getById(req, res, next) {
        try {
            const { id } = req.params.id 
            const user = await UserService.findById(id)
            return res.status(200).json(user)
        } catch(err) {
            next(err)
        }
    }
}

module.exports = new UserController()