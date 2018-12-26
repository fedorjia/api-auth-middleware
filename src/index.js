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
 * if the nonce is valid
 */
exports.isValidNonce = function(secret, nonce) {
	return md5(nonce, MD5_SALT) === secret
}