const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const ReserveSchema = Schema({
  id_user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  data_inicio: {
    type: String,
    required: true
  },
  data_fim: {
    type: String,
    required: true
  },
  id_carro: {
    type: Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },
  id_locadora: {
    type: Schema.Types.ObjectId,
    ref: 'Rental',
    required: true
  },
  valor_final: {
    type: Number,
    required: true
  }
});

ReserveSchema.plugin(mongoosePaginate);

const Reserve = model('Reserve', ReserveSchema);

module.exports = Reserve;
