const jwt =  require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

const userAuthentication = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader)
        throw new Error('Token not provided')

    const parts = authHeader.split(' ')
    if(parts.length !== 2) 
        throw new Error('The token has an invalid format')

    const [, token] = parts
    jwt.verify(token, process.env.API_SECRET) 
    next()
  } catch (err) {
      return res.status(401).json(err.message)
  }
}

module.exports = userAuthentication