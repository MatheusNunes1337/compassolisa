const Joi = require('joi');
const errorSerialize = require('../../serialize/errorSerialize');
const { getLicensePlatePattern, getObjectIdPattern } = require('../../utils/getPatterns');

const updateFleet = async (req, res, next) => {
  try {
    const schema = Joi.object({
      id_carro: Joi.string().trim().regex(getObjectIdPattern()).messages({
        'string.pattern.base': `id_carro must have 24 hexadecimal characters`
      }),
      status: Joi.string().trim(),
      valor_diaria: Joi.number().min(0),
      placa: Joi.string().trim().regex(getLicensePlatePattern()).messages({
        'string.pattern.base': `placa must have the XXX0000 pattern`
      })
    });

    const { error } = await schema.validate(req.body, { abortEarly: false });
    if (error) throw error;

    return next();
  } catch (err) {
    return res.status(400).json(errorSerialize(err));
  }
};

module.exports = updateFleet;
