const Joi = require('joi')

const convertDateFormat = require('../utils/convertDateFormat')

const userValidation = async (req, res, next) => {
    try {
        const userData = Object.assign({}, req.body)
        const { reference_date, dob_formated } = convertDateFormat(userData.data_nascimento)
        
        if(userData.data_nascimento) {
            userData.data_nascimento = dob_formated
        }
        
        const schema = Joi.object({
            nome: Joi.string().when('method', { is: 'POST', then: Joi.required(), otherwise: Joi.optional()}),
            cpf: Joi.string().pattern(new RegExp(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/)).when('method', { is: 'POST', then: Joi.required(), otherwise: Joi.optional()}),
            data_nascimento: Joi.date().max(reference_date).when('method', { is: 'POST', then: Joi.required(), otherwise: Joi.optional()}),
            email: Joi.string().email().when('method', { is: 'POST', then: Joi.required(), otherwise: Joi.optional()}),
            senha: Joi.string().min(6).when('method', { is: 'POST', then: Joi.required(), otherwise: Joi.optional()}),
            habilitado: Joi.string().valid('sim', 'não').when('method', { is: 'POST', then: Joi.required(), otherwise: Joi.optional()})
        })
        await schema.validateAsync(userData, { method: req.method }, {abortEarly: true}) 
        return next()    
    } catch(err) {
        return res.status(400).json(err.message)
    }
}

module.exports = userValidation