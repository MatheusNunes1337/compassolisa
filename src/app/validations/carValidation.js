const Joi = require('joi');

const carValidation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      modelo: Joi.string()
      .when('method', { is: 'POST', then: Joi.required(), otherwise: Joi.optional() }),
      cor: Joi.string()
      .when('method', { is: 'POST', then: Joi.required(), otherwise: Joi.optional() }),
      ano: Joi.number()
        .min(1950)
        .max(2022)
        .when('method', { is: 'POST', then: Joi.required(), otherwise: Joi.optional() }),
      acessorios: Joi.array().min(1).unique('descricao')
        .when('method', { is: 'POST', then: Joi.required(), otherwise: Joi.optional() })
        .label('You must to add 1 acessorio at least and they must be unique'),
      quantidadePassageiros: Joi.number()
        .when('method', { is: 'POST', then: Joi.required(), otherwise: Joi.optional() }),
    });
    await schema.validateAsync(req.body, { method: req.method }, { abortEarly: false });
    return next();
  } catch (err) {
    return res.status(400).json(err.message);
  }
};

module.exports = carValidation;
