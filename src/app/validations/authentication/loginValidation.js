const Joi = require('joi');
const errorSerialize = require('../../serialize/errorSerialize');

const loginValidation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      senha: Joi.string().trim().min(6).required()
    });

    const { error } = await schema.validateAsync(req.body, { abortEarly: false });
    if (error) throw error;
    return next();
  } catch (err) {
    return res.status(400).json(errorSerialize(err));
  }
};

module.exports = loginValidation;
