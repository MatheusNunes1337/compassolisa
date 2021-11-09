const Joi = require('joi');
const errorSerialize = require('../../serialize/errorSerialize');

const createAndUpdate = async(req, res, next) => {
    try {
        const schema = Joi.object({
            nome: Joi.string().trim()
            .when('method', { is: 'POST', then: Joi.required(), otherwise: Joi.optional() }),
            cnpj: Joi.string().trim().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/)
            .messages({
                "string.pattern.base": `cpnj must have the xx.xxx.xxx/xxxx-xx format`,
            })
            .when('method', { is: 'POST', then: Joi.required(), otherwise: Joi.optional() }),
            atividades: Joi.string().trim()
            .when('method', { is: 'POST', then: Joi.required(), otherwise: Joi.optional() }),
            endereco: Joi.array().items(
                Joi.object({
                    cep: Joi.string().trim().regex(/^\d{5}-\d{3}$/).required()
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
            .min(1)
            .unique()
            .messages({
                "array.min": `a rental must have one address at least`,
            })
            .when('method', { is: 'POST', then: Joi.required(), otherwise: Joi.optional() })
          });

        const { error } = await schema.validateAsync(req.body, { method: req.method }, { abortEarly: false });
        if(error) throw error
        return next();
    } catch(err) {
        return res.status(400).json(errorSerialize(err));
    }
}

module.exports = createAndUpdate
