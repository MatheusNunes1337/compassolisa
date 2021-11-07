const RentalRepository = require('../repositories/RentalRepository');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');

class RentalService {
    async getAll({ offset, limit, ...filter }) {
   
        offset ? parseInt(offset): undefined;
        limit ? parseInt(limit) : undefined;
        
        if(offset < 0 || limit < 0) 
          throw new BadRequest('Limit and offset cannot be negative')
        
        return await RentalRepository.getAll(offset, limit, filter);
      }
}

module.exports = new RentalService();
