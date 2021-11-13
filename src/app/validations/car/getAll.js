const Joi = require('joi');
const errorSerialize = require('../../serialize/errorSerialize');

const getAll = async (req, res, next) => {
  try {
    const schema = Joi.object({
      offset: Joi.number().min(0),
      limit: Joi.number().min(0),
      modelo: Joi.string().trim(),
      cor: Joi.string().trim(),
      ano: Joi.number().min(1950).max(2022),
      descricao: Joi.string().trim(),
      quantidadePassageiros: Joi.number()
    });

    const { error } = await schema.validate(req.query, { abortEarly: false });
    if (error) throw error;
    return next();
  } catch (err) {
    return res.status(400).json(errorSerialize(err));
  }
};

module.exports = getAll;
