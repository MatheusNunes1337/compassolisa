const Joi = require('joi').extend(require('@joi/date'));
const errorSerialize = require('../../serialize/errorSerialize');
const { getObjectIdPattern } = require('../../utils/getPatterns');

const updateReserve = async (req, res, next) => {
  try {
    const schema = Joi.object({
      data_inicio: Joi.date().format('DD/MM/YYYY').messages({
        'date.format': `data_inicio must have the DD/MM/YYYY format`
      }),
      data_fim: Joi.date().format('DD/MM/YYYY').messages({
        'date.format': `data_fim must have the DD/MM/YYYY format`
      }),
      id_carro: Joi.string().trim().regex(getObjectIdPattern()).messages({
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

module.exports = updateReserve;
