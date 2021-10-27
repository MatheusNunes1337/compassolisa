const Joi = require('joi').extend(require('@joi/date'))
const moment = require('moment')

const userValidation = async (req, res, next) => {
    try {
        const reference_date  = moment().subtract(18, 'years').format("MM-DD-YYYY")
       
        const schema = Joi.object({
            nome: Joi.string().when('method', { is: 'POST', then: Joi.required(), otherwise: Joi.optional()}),
            cpf: Joi.string().pattern(new RegExp(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/)).when('method', { is: 'POST', then: Joi.required(), otherwise: Joi.optional()}),
            data_nascimento: Joi.date()
            .format('DD/MM/YYYY')
            .max(reference_date)
            .when('method', { is: 'POST', then: Joi.required(), otherwise: Joi.optional()})
            .label('You must be over 18'),
            email: Joi.string().email().when('method', { is: 'POST', then: Joi.required(), otherwise: Joi.optional()}),
            senha: Joi.string().min(6).when('method', { is: 'POST', then: Joi.required(), otherwise: Joi.optional()}),
            habilitado: Joi.string().valid('sim', 'não').when('method', { is: 'POST', then: Joi.required(), otherwise: Joi.optional()})
        })
        await schema.validateAsync(req.body, { method: req.method }, {abortEarly: true}) 
        return next()    
    } catch(err) {
        return res.status(400).json(err.message)
    }
}

module.exports = userValidation