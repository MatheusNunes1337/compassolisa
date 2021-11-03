const Joi = require('joi');

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
    console.log('error', error)
    if(error) throw error
    return next();
  } catch (err) {
    const error = {descrption: 'invalid param', name: err.message}
    return res.status(400).json(error);
  }
};

module.exports = checkIdFormat;
