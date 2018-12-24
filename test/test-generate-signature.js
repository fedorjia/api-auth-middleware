const crypto = require('crypto')

const md5 = function (str, salt) {
	const hash = crypto.createHash('md5')
	hash.update(str + (salt || ''))
	// hash.update(new Buffer(str + (salt || '')).toString('binary'))
	return hash.digest('hex')
}

const sign = function (data, key) {
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


/**
 * generate signature
 */
function generateSignature(userid, timestamp, token, urlPath, params) {
	params = Object.assign({
		v_user: userid,
		v_timestamp: timestamp,
		v_url: urlPath
	}, params)

	return sign(params, token)
}


const userid = 1
const timestamp = 1540256129230
const urlPath = '/api/account/1'
const token = '3LMlDNiXtZkg/+rTufFIL2BpbkA5hJql7ariRZsiBDudPSiE4mbCuYEla3CEtdWM'
const params = {

}

// 88BA809F9A0A23731406B9E224C30103
console.log(generateSignature(userid, timestamp, token, urlPath, params))