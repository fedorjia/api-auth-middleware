const matcher = require('micromatch');
const authConfig = require('./auth')

function getPermission(uri, method) {
	let result = undefined
	for (let item in authConfig) {
		if (authConfig.hasOwnProperty(item)) {
			console.log(uri, item, matcher.isMatch(uri, item))
			if (matcher.isMatch(uri, item)) {
				const v = authConfig[item]
				result = v[method]
				break
			}
		}
	}
	return result
}

const permissions = [
	'user:add',
	'user:list',
	'user:update'
]
const url = '/api/user/1010'
const method = 'put'
const prefix = '/api'
const uri = url.substring(prefix.length)

const permission = getPermission(uri, method)

if (!permission) {
	return console.log('not found permission')
}
if (!permissions.includes(permission)) {
	return console.log('no permission')
}

return console.log('permission passed √')


