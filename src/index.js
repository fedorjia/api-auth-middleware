const {md5} = require('./helper/crypto')
const {MD5_SALT} = require('./generic/config')
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
	return md5(password, MD5_SALT) === secret
}