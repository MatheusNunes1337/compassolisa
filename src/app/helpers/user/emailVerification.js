const Conflict = require('../../errors/Conflict');
const UserSchema = require('../../schemas/UserSchema');

const emailVerification = async (email) => {
  const user = await UserSchema.findOne({ email });
  if (user) throw new Conflict(`Email ${email} already in use`);
};

module.exports = emailVerification;
