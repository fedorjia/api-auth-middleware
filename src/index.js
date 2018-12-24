const {sha256} = require('./helper/crypto')
const {SHA_SALT} = require('./generic/config')
const decodeToken = require('./generic/token')

/**
 * authorization middleware
 */
exports.authMiddleware = require('./middleware/auth')

/**
 * decode token
 */
exports.decodeToken = decodeToken

/**
 * if the password is valid
 */
exports.isValidPassword = function(secret, password) {
	return sha256(password, SHA_SALT) === secret
}