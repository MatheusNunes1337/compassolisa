const Joi = require('joi');
const errorSerialize = require('../../serialize/errorSerialize');

const accessoryValidation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      descricao: Joi.string().trim().min(3).required().messages({
        'string.empty': `Accessory description is not allowed to be empty`,
        'string.base': `Accessory description must be a string`,
        'string.min': `Accessory description length must be at least 3 characters long`
      })
    });

    const { error } = await schema.validate(req.body, { abortEarly: false });
    if (error) throw error;

    return next();
  } catch (err) {
    return res.status(400).json(errorSerialize(err));
  }
};

module.exports = accessoryValidation;
