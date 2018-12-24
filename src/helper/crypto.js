const crypto = require('crypto')

/**
 * md5
 */
const md5 = function (str, salt) {
	const hash = crypto.createHash('md5')
	hash.update(str + (salt || ''))
	// hash.update(new Buffer(str + (salt || '')).toString('binary'))
	return hash.digest('hex')
}
exports.md5 = md5

/**
 * sha256
 */
exports.sha256 = function (str, secret) {
	return crypto.createHmac('sha256', secret).update(str).digest('hex')
}

/**
 * generate unique id
 */
exports.uniqueid = function (len) {
	len = len || 24
	return crypto.randomBytes(Math.ceil(len/2)).toString('hex').slice(0,len)
}

/**
 * signature
 */
exports.sign = function (data, key) {
	const keys = []
	for (let k in data) {
		if (data.hasOwnProperty(k)) {
			if (JSON.stringify(data[k]).length < 64) { // exclude value which very long
				keys.push(k)
			}
		}
	}
	let str = ''
	keys.sort()
	keys.forEach((key) => {
		str += (key + '=' + data[key] + '&')
	})
	str += 'key=' + key
	return md5(str).toUpperCase()
}