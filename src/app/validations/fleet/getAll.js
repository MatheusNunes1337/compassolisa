const Joi = require('joi');
const errorSerialize = require('../../serialize/errorSerialize');
const { getLicensePlatePattern, getObjectIdPattern } = require('../../utils/getPatterns');

const getAll = async (req, res, next) => {
  try {
    const schema = Joi.object({
      offset: Joi.number().min(0),
      limit: Joi.number().min(0),
      id_carro: Joi.string().trim().regex(getObjectIdPattern()).messages({
        'string.pattern.base': `id_carro must have 24 hexadecimal characters`
      }),
      status: Joi.string().trim(),
      valor_diaria: Joi.number().min(0),
      placa: Joi.string().trim().regex(getLicensePlatePattern()).messages({
        'string.pattern.base': `placa must have the XXX0000 pattern`
      })
    });

    const { error } = await schema.validate(req.query, { abortEarly: false });
    if (error) throw error;

    return next();
  } catch (err) {
    return res.status(400).json(errorSerialize(err));
  }
};

module.exports = getAll;
