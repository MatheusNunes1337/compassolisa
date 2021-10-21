const UserRepository = require('../repositories/UserRepository')
const NotFound = require('../errors/NotFound')

class UserService {
    async findById(id) {
        try {
            const user = UserRepository.getById(id)
            if(!user) {
                throw new NotFound('User')
            }
            return user
        } catch(err) {
            return err
        }
    }

}