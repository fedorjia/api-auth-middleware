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
const token = '+gJTGNrJqm717HpQOHl5JJrNjS67XUMevkXbOpfHU9TdMWIIDNOoG3RldRkHdqad'
const params = {
	version: '1.0.1'
}

// 2DB40834BA2D386FD08E70520A161C80
console.log(generateSignature(accountId, timestamp, token, urlPath, params))