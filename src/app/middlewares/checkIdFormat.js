const Joi = require('joi');
const errorSerialize = require('../serialize/errorSerialize')
const InvalidParam = require('../errors/InvalidParam')

const checkIdFormat = async (req, res, next) => {
  try {
    const pattern = /[0-9a-fA-F]{24}/;
    const schema = Joi.object({
      id: Joi.string()
        .regex(pattern)
        .messages({
          "string.pattern.base": `id must be 24 hexadecimal numbers`,
        })
    });
    const { error } = await schema.validate(req.params, { abortEarly: false });
    console.log(error)
    if(error) throw new InvalidParam(error.message)
    return next();
  } catch (err) {
    return res.status(400).json(errorSerialize(err));
  }
};

module.exports = checkIdFormat;
