const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const CarSchema = Schema({
  modelo: {
    type: String,
    required: true,
  },
  cor: {
    type: String,
    required: true,
  },
  ano: {
    type: Number,
    required: true,
  },
  acessorios: [
    { descricao: String, _id: false },
  ],
  quantidadePassageiros: {
    type: Number,
    required: true,
  },
  __v: {
    type: Number,
    select: false,
  },
});

CarSchema.plugin(mongoosePaginate);

const Car = model('Car', CarSchema);

module.exports = Car;
