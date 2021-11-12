const Joi = require('joi').extend(require('@joi/date'));
const errorSerialize = require('../../serialize/errorSerialize')
const getReferenceDate = require('../../utils/getReferenceDate')
const {getCpfPattern} = require('../../utils/getPatterns')

const createUser = async (req, res, next) => {
  try {
    const schema = Joi.object({
      nome: Joi.string().trim().required(),
      cpf: Joi.string().regex(getCpfPattern()).required()
      .messages({
        "string.pattern.base": `cpf must have the xxx.xxx.xxx-xx format`,
      }),  
      data_nascimento: Joi.date().format('DD/MM/YYYY').max(getReferenceDate()).required()
      .messages({
        "date.format": `The day of birthday must have the DD/MM/YYYY format`,
        "date.max": `You must be over 18`
      }),
      email: Joi.string().email().trim().required(),
      senha: Joi.string().trim().min(6).required(),
      habilitado: Joi.string().trim().valid('sim', 'não').required()
    });
    
    const { error } = await schema.validate(req.body, { abortEarly: false }); 
    if(error) throw error

    return next();
  } catch (err) {
    return res.status(400).json(errorSerialize(err));
  }
};

module.exports = createUser;
