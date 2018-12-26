/**
 * 参数验证
 */
const matcher = require('micromatch');

const aes = require('../helper/aes')
const {sign, md5} = require('../helper/crypto')
const {isExclude} = require('../generic/excludes')
const {AES_SALT, MD5_SALT} = require('../generic/config')
const Cache = require('../helper/cache')

let cache

const jsonBussError = function (res, message) {
	res.json({status: 300, body: null, message: message})
}

const jsonLoginError = function (res, message) {
	res.json({status: 1001, body: null, message: message})
}

const decodeToken = function (token) {
	if (!token) {
		return null
	}

	const tokenDecodeStr = aes.decode(token, AES_SALT)
	const tokenDecodeArr = tokenDecodeStr.split(',')
	if (tokenDecodeArr.length !== 2) { // invalid token
		return null
	}
	return {
		id: tokenDecodeArr[0],
		secret: tokenDecodeArr[1]
	}
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
 *    isVerifyParameters: 是否需要验证parameters
 *    isVerifyPermission: 是否需要验证permission
 *    permissions: 设定的权限
 *    cache: cache-service config
 */
module.exports = function (config = {
	prefix: '/api',
	isVerifyParameters: true,
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

			let tokenInfo
			const token = req.headers.h_token

			if (!config.isVerifyParameters) {
				tokenInfo = decodeToken(token)
				if (!tokenInfo) {
					return jsonBussError(res, 'invalid token')
				}
			} else {
				if (!cache) {
					cache = new Cache(config.cache)
				}

				// const method = req.method.toLowerCase()
				const signature = req.headers.h_signature
				const timestamp = req.headers.h_timestamp

				if (!token) {
					return jsonBussError(res, 'lost token in headers')
				}
				if (!signature) {
					return jsonBussError(res, 'lost signature in headers')
				}
				if (!timestamp) {
					return jsonBussError(res, 'lost timestamp in headers')
				}

				tokenInfo = decodeToken(token)
				if (!tokenInfo) {
					return jsonBussError(res, 'invalid token')
				}

				const accountId = tokenInfo.id

				let pathname = req.pathname
				if (typeof pathname !== 'string') {
					pathname = req.path
				}

				const params = Object.assign({
					__url__: pathname,
					__account__: accountId,
					__timestamp__: timestamp
				}, req.query, req.body)

				// verify signature
				const mSignature = sign(params, token)
				if (signature !== mSignature) {
					return jsonBussError(res, 'invalid signature')
				}
			}

			const { id: accountId, secret } = tokenInfo

			const cacheRs = await cache.get(`account:${accountId}`)
			if (!cacheRs) {
				return jsonLoginError(res, 'not found in cache, should login!')
			}
			const { account, nonce } = cacheRs

			// verify secret value
			const mSecret = md5(nonce, MD5_SALT)
			if (mSecret !== secret) {
				return jsonLoginError(res, 'invalid secret')
			}
			if (!config.isVerifyPermission) { // not necessary verify permission
				res.locals.account = account
				return next()
			}

			const permissions = account.permissions
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
			res.locals.account = account

			return next()
		} catch (err) {
			return jsonBussError(res, err.message)
		}
	}
}