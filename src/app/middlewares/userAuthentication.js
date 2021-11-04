const jwt =  require('jsonwebtoken')
const dotenv = require('dotenv')

const errorSerialize = require('../serialize/errorSerialize')
const Authentication = require('../errors/Authentication')

dotenv.config()

const userAuthentication = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader)
        throw new Authentication('Token not provided')

    const parts = authHeader.split(' ')
    if(parts.length !== 2) 
        throw new Authentication('The token has an invalid format')

    const [, token] = parts
    jwt.verify(token, process.env.API_SECRET) 
    next()
  } catch (err) {
      return res.status(401).json(errorSerialize(err))
  }
}

module.exports = userAuthentication