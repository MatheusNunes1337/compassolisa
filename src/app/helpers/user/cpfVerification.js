const Conflict = require('../../errors/Conflict');
const UserSchema = require('../../schemas/UserSchema');

const cpfVerification = async (cpf) => {
  const user = await UserSchema.findOne({ cpf });
  if (user) throw new Conflict(`CPF ${cpf} already in use`);
};

module.exports = cpfVerification;
