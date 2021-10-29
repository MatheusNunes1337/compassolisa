const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const UserSchema = Schema({
  nome: {
    type: String,
    required: true,
  },
  cpf: {
    type: String,
    unique: true,
    required: true,
  },
  data_nascimento: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  senha: {
    type: String,
    required: true,
  },
  habilitado: {
    type: String,
    required: true,
  },
  __v: {
    type: Number,
    select: false,
  },
});

UserSchema.plugin(mongoosePaginate);

const User = model('User', UserSchema);

module.exports = User;
