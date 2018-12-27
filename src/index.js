const {md5, uniqueid} = require('./helper/crypto')
const aes = require('./helper/aes')
const {MD5_SALT, AES_SALT} = require('./generic/config')

/**
 * auth cache
 */
const cache = exports.cache = require('./helper/cache')

/**
 * detect auth token & nonce
 */
exports.detectAuth = require('./generic/detect')

/**
 * authorization middleware
 */
exports.authMiddleware = require('./middleware/auth')

/**
 * create auth and store
 */
exports.createAuth = async function(id, permissions) {
	const nonce = uniqueid(24)
	const secret = md5(nonce, MD5_SALT)
	const token = aes.encode(`id=${id}&secret=${secret}`, AES_SALT)

	// save auth to cache
	if (cache.enabled()) {
		const o = {
			nonce,
			token
		}
		if (permissions) {
			o.permissions = permissions
		}
		await cache.save(`account:${id}`, o)
	}

	return {
		nonce,
		token
	}
}
