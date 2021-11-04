const Joi = require('joi');

const loginValidation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      senha: Joi.string().trim().min(6).required()
    });
    
    const { error } = await schema.validateAsync(req.body, { abortEarly: false });
    if(error) throw error
    return next();
  } catch (err) {
    const {message, path} = err.details[0]
    const error = {description: path[0], name: message}
    return res.status(400).json(error);
  }
};

module.exports = loginValidation;
