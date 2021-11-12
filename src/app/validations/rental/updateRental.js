const Joi = require('joi');
const errorSerialize = require('../../serialize/errorSerialize')
const {getCnpjPattern, getCepPattern} = require('../../utils/getPatterns')

const updateRental = async (req, res, next) => {
  try {
    const schema = Joi.object({
      nome: Joi.string().trim(),
      cnpj: Joi.string().trim().regex(getCnpjPattern())
      .messages({
          "string.pattern.base": `cpnj must have the xx.xxx.xxx/xxxx-xx format`,
      }),
      atividades: Joi.string().trim(),
      endereco: Joi.array().items(
          Joi.object({
              cep: Joi.string().trim().regex(getCepPattern()).required()
              .messages({
                  "string.pattern.base": `cep must have the xxxxx-xxx format`,
                  "string.empty": `cep is not allowed to be empty`,
                  "any.required": `cep is required`
              }),
              complemento: Joi.string().allow(''),
              number: Joi.number().required()
              .messages({
                  "any.required": `number is required`,
              }),
              isFilial: Joi.boolean().required()
              .messages({
                  "boolean.base": "isFilial must be a true or false",
                  "any.required": `isFilial is required`,
              })
          })
      )
      .min(1).unique()
      .messages({
          "array.min": `a rental must have one address at least`,
      })
    });
    
    const { error } = await schema.validate(req.body, { abortEarly: false }); 
    if(error) throw error

    return next();
  } catch (err) {
    return res.status(400).json(errorSerialize(err));
  }
};

module.exports = updateRental;
