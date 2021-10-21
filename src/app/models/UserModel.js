const { model, Schema } = require('mongoose')

const UserSchema = Schema({
    nome: {
        type: String,
        required: true
    },    
    cpf: {
        type: String,
        unique: true,
        required: true
    },
    data_nascimento: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    habilitado: {
        type: String,
        required: true
    }  
})

const User = model('User', UserSchema)

module.exports = User