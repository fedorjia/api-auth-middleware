const {md5} = require('../helper/crypto')
const aes = require('../helper/aes')
const {MD5_SALT, AES_SALT} = require('./config')

module.exports = function(token, nonce) {
	// decode token
	const str = aes.decode(token, AES_SALT)
	const arr = str.split('&')
	if (arr.length !== 2) {
		throw new Error('invalid token!')
	}
	const idArr = arr[0].split('=')
	const secretArr = arr[1].split('=')
	if (idArr.length !== 2 || secretArr.length !== 2) {
		throw new Error('invalid token detail!')
	}
	const id = idArr[1]
	const secret = secretArr[1]

	if (md5(nonce, MD5_SALT) !== secret) {
		throw new Error('invalid token secret!')
	}

	return id
}