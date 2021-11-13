const Joi = require('joi').extend(require('@joi/date'));
const errorSerialize = require('../../serialize/errorSerialize');
const { getCpfPattern } = require('../../utils/getPatterns');

const getAll = async (req, res, next) => {
  try {
    const schema = Joi.object({
      offset: Joi.number().min(0),
      limit: Joi.number().min(0),
      nome: Joi.string().trim(),
      cpf: Joi.string().trim().regex(getCpfPattern()).messages({
        'string.pattern.base': `cpf must have the xxx.xxx.xxx-xx format`
      }),
      data_nascimento: Joi.date().format('DD/MM/YYYY').messages({
        'date.format': `The day of birthday must have the DD/MM/YYYY format`
      }),
      email: Joi.string().email(),
      habilitado: Joi.string().valid('sim', 'não')
    });

    const { error } = await schema.validate(req.query, { abortEarly: false });
    if (error) throw error;

    return next();
  } catch (err) {
    return res.status(400).json(errorSerialize(err));
  }
};

module.exports = getAll;
