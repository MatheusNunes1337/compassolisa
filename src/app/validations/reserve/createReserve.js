const Joi = require('joi').extend(require('@joi/date'));
const errorSerialize = require('../../serialize/errorSerialize');
const { getObjectIdPattern } = require('../../utils/getPatterns');

const createReserve = async (req, res, next) => {
  try {
    const schema = Joi.object({
      data_inicio: Joi.date().format('DD/MM/YYYY').required().messages({
        'date.format': `data_inicio must have the DD/MM/YYYY format`
      }),
      data_fim: Joi.date().format('DD/MM/YYYY').required().messages({
        'date.format': `data_fim must have the DD/MM/YYYY format`
      }),
      id_carro: Joi.string().trim().regex(getObjectIdPattern()).required().messages({
        'string.pattern.base': `id_carro must have 24 hexadecimal characters`
      })
    });

    const { error } = await schema.validate(req.body, { abortEarly: false });
    if (error) throw error;

    return next();
  } catch (err) {
    return res.status(400).json(errorSerialize(err));
  }
};

module.exports = createReserve;
