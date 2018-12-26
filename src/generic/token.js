/**
 * decode token
 */
const aes = require('../helper/aes')
const {AES_SALT} = require('./config')

module.export = function(token) {
	const str = aes.decode(token, AES_SALT)
	const arr = str.split(',')
	if (arr.length !== 2) {
		return null
	}
	const id = arr[0]
	const secret = arr[1]

	return {
		id,
		secret
	}
}