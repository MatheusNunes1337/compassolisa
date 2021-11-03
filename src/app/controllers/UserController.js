const UserService = require('../services/UserService');

class UserController {
  async getAll(req, res, next) {
    try {
      const response = await UserService.findAll(req.query);

      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await UserService.findById(id);
      if (user) return res.status(200).json(user);
      return res.status(204).end();
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const user = await UserService.create(req.body);
      user.senha = undefined
      return res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const response = await UserService.update(id, req.body);
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await UserService.delete(id);
      return res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
