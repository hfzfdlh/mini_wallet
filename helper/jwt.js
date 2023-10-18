const jwt = require('jsonwebtoken')
const key = process.env.JWT_KEY

const createToken = (id) => jwt.sign({id:id}, key)

const verifyToken = (token) => jwt.verify(token,key)

module.exports ={ createToken, verifyToken}