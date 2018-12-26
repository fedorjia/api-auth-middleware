const {sign} = require('../src/helper/crypto')

/**
 * generate signature
 */
function generateSignature(accountId, timestamp, token, urlPath, params) {
	params = Object.assign({
		__url__: urlPath,
		__account__: accountId,
		__timestamp__: timestamp
	}, params)

	return sign(params, token)
}


const accountId = 1
const timestamp = 1540256129230
const urlPath = '/api/account/1'
const token = '1+680btmwiJ98uVGzLwuC/S7zfYJDY2LY6t1QhdziEcOCpKNMEZGZtQqV04MBL+k'
const params = {
	version: '1.0.1'
}

// 6DCD3B395B6D74BB98A0D8E6B56DDA30
console.log(generateSignature(accountId, timestamp, token, urlPath, params))