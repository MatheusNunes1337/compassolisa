const Conflict = require('../../errors/Conflict')
const UserModel = require('../../models/UserModel');

const cpfVerification = async (cpf) => {
    const user = await UserModel.findOne({cpf})
    if(user)
        throw new Conflict(`CPF ${cpf} already in use`)
};

module.exports = cpfVerification;
