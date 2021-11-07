const axios = require('axios');
const errorSerialize = require('../serialize/errorSerialize')

class AddressProvider {
    async getAddress(cep) {
        try {
            const {data} = await axios.get(`https://viacep.com.br/ws/${cep}/json`)
            console.log(data)
        } catch(err) {
            return res.status(400).json(errorSerialize(err))
        }
    }
}

const adressProvider = new AddressProvider()
adressProvider.getAddress('96055-74000')

//module.exports = new AdressProvider();
