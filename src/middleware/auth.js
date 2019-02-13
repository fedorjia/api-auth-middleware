/**
 * 参数验证
 */
const matcher = require('micromatch');

const {sign, md5} = require('../helper/crypto')
const {match} = require('../generic/match')
const detectAuth = require('../generic/detect')
const authCache = require('../helper/cache')

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
	isVerifyPermission: false,
	cache: null
}) {
	return async (req, res, next) => {
		try {
			const url = req.url
			const method = req.method.toLowerCase()
			const prefix = config.prefix || ''
			const tmpIndex = url.indexOf('?')
			let uri = url.substring(prefix.length)
			if (tmpIndex !== -1) {
				uri = url.substring(prefix.length, tmpIndex)
			} else {
				uri = url.substring(prefix.length)
			}

			const includes = config.includes
			if (!includes) {
				return next()
			}

			if (!match(includes, url)) {
				return next()
			}

			const excludes = config.excludes || []
			excludes.push('/favicon.ico')
			if (match(excludes, url)) {
				return next()
			}

			// const method = req.method.toLowerCase()
			const token = req.headers['h-token']
			const nonce = req.headers['h-nonce']
			const signature = req.headers['h-signature']
			const timestamp = req.headers['h-timestamp']

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

			const account = detectAuth(token, nonce)

			// let pathname = req.pathname
			// if (typeof pathname !== 'string') {
			// 	pathname = req.path
			// }

			const params = Object.assign({
				__timestamp__: timestamp
			}, req.query, req.body)

			// verify signature
			const mSignature = sign(params, token)
			if (signature !== mSignature) {
				return jsonBussError(res, 'invalid signature')
			}

			// not necessary verify permission
			if (!config.isVerifyPermission) {
				res.locals.account = account
				return next()
			}

			// verify permission
			if (config.cache && !authCache.enabled()) {
				// enable cache
				authCache.enable(config.cache)
			}

			if (!authCache.enabled()) {
				return jsonLoginError(res, 'cache not enabled!')
			}

			// get account info
			const cacheRs = await authCache.get(md5(`account:${account}`))
			if (!cacheRs) {
				return jsonLoginError(res, 'account not found in cache, should login!')
			}

			const accountPermissions = cacheRs.permissions
			if (!accountPermissions || accountPermissions.length === 0) {
				return jsonBussError(res, 'account has no permissions')
			}
			// detect permission
			const permission = getPermission(config.permissions, uri, method)
			if (permission) {
				if (!accountPermissions.includes(permission)) {
					return jsonBussError(res, 'permission not allowed')
				}
			}
			// set account to res.locals
			res.locals.account = account

			return next()
		} catch (err) {
			return jsonBussError(res, err.message)
		}
	}
}