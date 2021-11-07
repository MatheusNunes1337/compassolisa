const axios = require('axios');

class AddressProvider {
    async getAddress(cep) {
        const {data} = await axios.get(`https://viacep.com.br/ws/${cep}/json`)
        console.log(data)
    }
}

const adressProvider = new AddressProvider()
adressProvider.getAddress('96055-740')

//module.exports = new AdressProvider();
