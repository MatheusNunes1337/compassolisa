const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const RentalSchema = Schema({
  nome: {
    type: String,
    required: true
  },
  cnpj: {
    type: String,
    required: true,
    unique: true
  },
  atividades: {
    type: String,
    required: true
  },
  endereco: [
    {
      _id: false,
      cep: { type: String, required: true },
      logradouro: { type: String, required: true },
      complemento: String,
      bairro: { type: String, required: true },
      number: { type: Number, required: true },
      localidade: { type: String, required: true },
      uf: { type: String, required: true },
      isFilial: { type: Boolean, required: true }
    }
  ]
});

RentalSchema.plugin(mongoosePaginate);

const Rental = model('Rental', RentalSchema);

module.exports = Rental;
