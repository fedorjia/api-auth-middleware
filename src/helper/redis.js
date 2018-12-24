const axios = require('axios')
const cacheURL = 'http://localhost:4001/get'

/**
 * cache-service get
 */
exports.get = async function(key) {
	const res = await axios.get(`${cacheURL}/${key}`)
	try {
		const data = res.data
		if (data.status !== 200) {
			return console.err(data)
		}
		return data.body
	} catch (err) {
		console.log(err)
	}
}


