const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const FleetSchema = Schema({
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
  status: {
    type: String,
    required: true
  },
  valor_diaria: {
    type: Number,
    required: true
  },
  placa: {
    type: String,
    required: true
  }
});

FleetSchema.plugin(mongoosePaginate);

const Fleet = model('Fleet', FleetSchema);

module.exports = Fleet;
