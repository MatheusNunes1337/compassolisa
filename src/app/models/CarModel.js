const { model, Schema } = require('mongoose')

const CarSchema = Schema({
    modelo: {
        type: String,
        required: true
    },
    cor: {
        type: String,
        required: true
    },
    ano: {
        type: Number,
        required: true
    },
    acessorios: [
        { descricao: String },
    ],
    quantidadePassageiros: {
        type: Number,
        required: true
    }
})

const Car = model('Car', CarSchema)

module.exports = Car