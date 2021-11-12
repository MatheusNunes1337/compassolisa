const Joi = require('joi');
const errorSerialize = require('../serialize/errorSerialize')
const InvalidParam = require('../errors/InvalidParam')
const {getObjectIdPattern} = require('../utils/getPatterns')

const checkIdFormat = async (req, res, next) => {
  try {
    const params = Object.values(req.params)
  
    const schema = Joi.object({
      id: Joi.array().items(Joi.string().regex(getObjectIdPattern()))
        .messages({
          "string.pattern.base": `id must be have 24 hexadecimal characters`,
        })
      });

    const { error } = await schema.validateAsync({id: params}, { abortEarly: false});

    if(error) throw new error
    return next();
  } catch (err) {
    return res.status(400).json(errorSerialize(err));
  }
};

module.exports = checkIdFormat;
