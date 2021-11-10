const Joi = require('joi').extend(require('@joi/date'));
const moment = require('moment');
const errorSerialize = require('../../serialize/errorSerialize')

const createAndUpdate = async (req, res, next) => {
  try {
    const reference_date = moment().subtract(18, 'years').format('MM-DD-YYYY');

    const schema = Joi.object({
      nome: Joi.string().trim().min(3)
      .when('method', { is: 'POST', then: Joi.required(), otherwise: Joi.optional() }),
      cpf: Joi.string().regex(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/)
      .when('method', { is: 'POST', then: Joi.required(), otherwise: Joi.optional() })
      .messages({
        "string.pattern.base": `cpf must have the xxx.xxx.xxx-xx format`,
      }),  
      data_nascimento: Joi.date().format('DD/MM/YYYY').max(reference_date)
      .when('method', { is: 'POST', then: Joi.required(), otherwise: Joi.optional() })
      .messages({
        "date.format": `The day of birthday must have the DD/MM/YYYY format`,
        "date.max": `You must be over 18`
      }),
      email: Joi.string().email()
      .when('method', { is: 'POST', then: Joi.required(), otherwise: Joi.optional() }),
      senha: Joi.string().trim().min(6)
      .when('method', { is: 'POST', then: Joi.required(), otherwise: Joi.optional() }),
      habilitado: Joi.string()
      .valid('sim', 'não')
      .when('method', { is: 'POST', then: Joi.required(), otherwise: Joi.optional() }),
    });
    
    const { error } = await schema.validateAsync(req.body, { method: req.method }, { abortEarly: false });
    if(error) throw error
    return next();
  } catch (err) {
    return res.status(400).json(errorSerialize(err));
  }
};

module.exports = createAndUpdate;