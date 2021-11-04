const Joi = require('joi').extend(require('@joi/date'));
const moment = require('moment');

const userValidation = async (req, res, next) => {
  try {
    const reference_date = moment().subtract(18, 'years').format('MM-DD-YYYY');

    const schema = Joi.object({
      nome: Joi.string().trim().min(3)
      .when('method', { is: 'POST', then: Joi.required(), otherwise: Joi.optional() }),
      cpf: Joi.string()
      .pattern(new RegExp(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/))
      .when('method', { is: 'POST', then: Joi.required(), otherwise: Joi.optional() })
      .messages({
        "string.pattern.base": `cpf must has the xxx.xxx.xxx-xx format`,
      }),  
      data_nascimento: Joi.date()
      .format('DD/MM/YYYY')
      .max(reference_date)
      .when('method', { is: 'POST', then: Joi.required(), otherwise: Joi.optional() })
      .messages({
        "date.format": `The day of birthday must has the DD/MM/YYYY format`,
        "date.max": `You must be over 18`
      }),
      email: Joi.string()
      .email()
      .when('method', { is: 'POST', then: Joi.required(), otherwise: Joi.optional() }),
      senha: Joi.string()
      .min(6)
      .when('method', { is: 'POST', then: Joi.required(), otherwise: Joi.optional() }),
      habilitado: Joi.string()
      .valid('sim', 'não')
      .when('method', { is: 'POST', then: Joi.required(), otherwise: Joi.optional() }),
    });
    
    const { error } = await schema.validateAsync(req.body, { method: req.method }, { abortEarly: false });
    if(error) throw error
    return next();
  } catch (err) {
    const {message, path} = err.details[0]
    const error = {description: path[0], name: message}
    return res.status(400).json(error);
  }
};

module.exports = userValidation;
