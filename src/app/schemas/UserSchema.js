const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const bcrypt = require('bcryptjs');

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
    type: String,
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
    enum: ['sim', 'não'],
    required: true
  }
});

UserSchema.pre('save', async function encryptPass(next) {
  const encriptedPassword = await bcrypt.hash(this.senha, 10);
  this.senha = encriptedPassword;
  next();
});

UserSchema.plugin(mongoosePaginate);

const User = model('User', UserSchema);

module.exports = User;
