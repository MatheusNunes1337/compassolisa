const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

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
  acessorios: [{ descricao: String }],
  quantidadePassageiros: {
    type: Number,
    required: true
  }
});

CarSchema.plugin(mongoosePaginate);

const Car = model('Car', CarSchema);

module.exports = Car;
