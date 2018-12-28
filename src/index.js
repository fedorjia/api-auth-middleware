const {md5, uniqueid} = require('./helper/crypto')
const aes = require('./helper/aes')
const {MD5_SALT, AES_SALT} = require('./generic/config')
const cache = require('./helper/cache')

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
exports.createAuth = async function(account, permissions) {
	try {
		const nonce = uniqueid(24)
		const secret = md5(nonce, MD5_SALT)
		const token = aes.encode(`account=${account}&secret=${secret}`, AES_SALT)

		// save auth to cache
		if (cache.enabled()) {
			const o = {
				nonce,
				token
			}
			if (permissions) {
				o.permissions = permissions
			}
			await cache.set(md5(`account:${account}`), o)
		}

		return {
			nonce,
			token
		}
	} catch (err) {
		throw new Error(err.message)
	}
}
