const Joi = require('joi');
const errorSerialize = require('../../serialize/errorSerialize')

const createCar = async (req, res, next) => {
  try {
    const schema = Joi.object({
      modelo: Joi.string().trim().required(),
      cor: Joi.string().trim().required(),
      ano: Joi.number().min(1950).max(2022).required(),
      acessorios: Joi.array().items(Joi.object({descricao: Joi.string().trim().required()}))
      .min(1).unique('descricao').required()
      .messages({
        "string.empty": `Descrição is not allowed to be empty`
      }),
      quantidadePassageiros: Joi.number().required()
    });
    
    const { error } = await schema.validate(req.body, { abortEarly: false });
    if(error) throw error

    return next();
  } catch (err) {
    return res.status(400).json(errorSerialize(err));
  }
};

module.exports = createCar;
