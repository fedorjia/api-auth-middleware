/**
 * 参数验证
 */
const matcher = require('micromatch');

const {sign} = require('../helper/crypto')
const {isExclude} = require('../generic/excludes')
const detectAuth = require('../generic/detect')
const cache = require('../helper/cache')

const jsonBussError = function (res, message) {
	res.json({status: 300, body: null, message: message})
}

const jsonLoginError = function (res, message) {
	res.json({status: 1001, body: null, message: message})
}

const getPermission = function (authConfig = {}, uri, method) {
	let result = undefined
	for (let item in authConfig) {
		if (authConfig.hasOwnProperty(item)) {
			if (matcher.isMatch(uri, item)) {
				const v = authConfig[item]
				result = v[method]
				break
			}
		}
	}
	return result
}


/**
 * @param config
 *    prefix: url 前缀，例如 /api
 *    excludes: 排除的urls
 *    isVerifyPermission: 是否需要验证permission
 *    permissions: 设定的权限
 *    cache: cache-service config
 */
module.exports = function (config = {
	prefix: '/api',
	isVerifyPermission: false
}) {
	return async (req, res, next) => {
		try {
			const url = req.url
			const method = req.method.toLowerCase()
			const prefix = config.prefix || ''
			const uri = url.substring(prefix.length)

			const excludes = config.excludes
			if (excludes && isExclude(excludes, url)) {
				return next()
			}

			// const method = req.method.toLowerCase()
			const token = req.headers.h_token
			const nonce = req.headers.h_nonce
			const signature = req.headers.h_signature
			const timestamp = req.headers.h_timestamp

			if (!token) {
				return jsonBussError(res, 'token required in headers')
			}
			if (!nonce) {
				return jsonBussError(res, 'nonce required in headers')
			}
			if (!signature) {
				return jsonBussError(res, 'signature required in headers')
			}
			if (!timestamp) {
				return jsonBussError(res, 'timestamp required in headers')
			}

			const accountId = detectAuth(token, nonce)

			let pathname = req.pathname
			if (typeof pathname !== 'string') {
				pathname = req.path
			}

			const params = Object.assign({
				__url__: pathname,
				__timestamp__: timestamp
			}, req.query, req.body)

			// verify signature
			const mSignature = sign(params, token)
			if (signature !== mSignature) {
				return jsonBussError(res, 'invalid signature')
			}

			if (!config.isVerifyPermission) { // not necessary verify permission
				res.locals.accountId = accountId
				return next()
			}

			// permissions
			if (!cache.enabled()) {
				return jsonLoginError(res, 'cache not enabled!')
			}
			// get account info
			const cacheRs = await cache.get(`account:${accountId}`)
			if (!cacheRs) {
				return jsonLoginError(res, 'account not found in cache, should login!')
			}

			const permissions = cacheRs.permissions
			if (!permissions || permissions.length === 0) {
				return jsonBussError(res, 'no permissions')
			}

			// detect permission
			const permission = getPermission(config.permissions, uri, method)
			if (!permission) { // not found permission
				return jsonBussError(res, 'permission not defined')
			}
			if (!permissions.includes(permission)) {
				return jsonBussError(res, 'no permission')
			}

			// set account to res.locals
			res.locals.accountId = accountId

			return next()
		} catch (err) {
			return jsonBussError(res, err.message)
		}
	}
}