/**
 * decode token
 */
const aes = require('../helper/aes')
const {defaultKey} = require('./config')

module.export = function(token) {
	const str = aes.decode(token, defaultKey)
	const arr = str.split(',')
	if (arr.length !== 2) {
		return null
	}
	const userid = arr[0]
	const secret = arr[1]

	return {
		userid,
		secret
	}
}