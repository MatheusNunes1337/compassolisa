const UserService = require('../services/UserService')

class UserController {
    async getById(req, res) {
        const { id } = req.params.id 
        const user = await UserService.findById(id)
        return res.status(200).json(user)
    }
}

module.exports = new UserController()