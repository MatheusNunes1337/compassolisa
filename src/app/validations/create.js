const Joi = require('joi')

const convertDateFormat = require('../../utils/convertDateFormat')

const createUser = async (req, res, next) => {
    try {
        const userData = Object.assign({}, req.body)
        const { reference_date, dob_formated } = convertDateFormat(userData.data_nascimento)
        userData.data_nascimento = dob_formated
        
        const schema = Joi.object({
            nome: Joi.string().required(),
            cpf: Joi.string().pattern(new RegExp(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/)).required(),
            data_nascimento: Joi.date().max('reference_date').required().label('You must be over 18 to create an account'),
            email: Joi.string().email().required(),
            senha: Joi.string().min(6).required(),
            habilitado: Joi.string().valid('sim', 'não').required()
        })
        await schema.validateAsync(userData, { reference_date }, {abortEarly: true}) 
        return next()    
    } catch(err) {
        return res.status(400).json(err.message)
    }
}

module.exports = createUser