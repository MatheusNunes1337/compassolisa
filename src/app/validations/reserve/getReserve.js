const Joi = require('joi').extend(require('@joi/date'));
const errorSerialize = require('../../serialize/errorSerialize');
const { getObjectIdPattern } = require('../../utils/getPatterns');

const getReserve = async (req, res, next) => {
  try {
    const schema = Joi.object({
      offset: Joi.number().min(0),
      limit: Joi.number().min(0),
      data_inicio: Joi.date().format('DD/MM/YYYY').messages({
        'date.format': `data_inicio must have the DD/MM/YYYY format`
      }),
      data_fim: Joi.date().format('DD/MM/YYYY').messages({
        'date.format': `data_fim must have the DD/MM/YYYY format`
      }),
      id_carro: Joi.string().trim().regex(getObjectIdPattern()).messages({
        'string.pattern.base': `id_carro must have 24 hexadecimal characters`
      }),
      id_locadora: Joi.string().trim().regex(getObjectIdPattern()).messages({
        'string.pattern.base': `id_locadora must have 24 hexadecimal characters`
      }),
      id_user: Joi.string().trim().regex(getObjectIdPattern()).messages({
        'string.pattern.base': `id_user must have 24 hexadecimal characters`
      }),
      valor_final: Joi.number().min(0)
    });

    const { error } = await schema.validate(req.query, { abortEarly: false });
    if (error) throw error;

    return next();
  } catch (err) {
    return res.status(400).json(errorSerialize(err));
  }
};

module.exports = getReserve;
