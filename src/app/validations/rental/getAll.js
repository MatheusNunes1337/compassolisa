const Joi = require('joi');
const errorSerialize = require('../../serialize/errorSerialize');

const getAll = async(req, res, next) => {
    try {
        const schema = Joi.object({
            offset: Joi.number().min(0),
            limit: Joi.number().min(0),
            nome: Joi.string().trim(),
            cnpj: Joi.string().trim().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/)
            .messages({
                "string.pattern.base": `cpnj must have the xx.xxx.xxx/xxxx-xx format`,
            }),
            atividades: Joi.string().trim(),
            cep: Joi.string().trim().regex(/^\d{5}-\d{3}$/)
            .messages({
                "string.pattern.base": `cep must have the xxxxx-xxx format`,
            }),
            complemento: Joi.string().trim(),
            number: Joi.number(),
            isFilial: Joi.boolean()
            .messages({
                "boolean.base": "isFilial must be a true or false"
            }),
            bairro: Joi.string().trim(),
            localidade: Joi.string().trim(),
            logradouro: Joi.string().trim(),
            uf: Joi.string().trim(),     
        });

        const { error } = await schema.validateAsync(req.query, { abortEarly: false });
        if(error) throw error
        return next();
    } catch(err) {
        return res.status(400).json(errorSerialize(err));
    }
}

module.exports = getAll
