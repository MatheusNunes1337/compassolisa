const RentalRepository = require('../../repositories/RentalRepository')
const {paginateSerialize} = require('../../serialize/rentalSerialize')
const Conflict = require('../../errors/Conflict')

const checkCnpjUsage = async (cnpj) => {
    const rental = await RentalRepository.getAll(0, 100, {cnpj})
    
    if(paginateSerialize(rental).locadoras.length > 0)
      throw new Conflict(`Cnpj ${cnpj} already in use`)
}

module.exports = checkCnpjUsage