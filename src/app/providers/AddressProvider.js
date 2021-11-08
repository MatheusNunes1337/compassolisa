const axios = require('axios');

class AddressProvider {
    async getAddress(cep) {
        const {data} = await axios.get(`https://viacep.com.br/ws/${cep}/json`)
        const {logradouro, bairro, localidade, uf} = data
        
        return {logradouro, bairro, localidade, uf}
    }
}

module.exports = new AddressProvider();
