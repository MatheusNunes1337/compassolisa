const UserModel = require('../models/UserModel');

const cpfVerification = async (cpf) => {
    const user = await UserModel.findOne({cpf})
    if(user)
        throw new Error(`CPF ${cpf} already in use`)
};

module.exports = cpfVerification;
