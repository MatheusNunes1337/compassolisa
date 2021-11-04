const Conflict = require('../errors/Conflict')
const UserModel = require('../models/UserModel');

const emailVerification = async (email) => {
    const user = await UserModel.findOne({email})
    if(user)
        throw new Conflict(`Email ${email} already in use`)
};

module.exports = emailVerification;
