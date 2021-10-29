const AuthService = require('../services/AuthService');

class AuthController {
  async login(req, res, next) {
    try {
      const response = await AuthService.login(req.body);
      return res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
