const axios = require('axios')

const CACHE_URL = 'http://localhost:4501/get'

module.exports = class {
	constructor(option) {
		if (!option) {
			throw new Error('cache constructor init error')
		}
		if (!option.appid) {
			throw new Error('appid required in cache constructor')
		}
		if (!option.appsecret) {
			throw new Error('appsecret required in cache constructor')
		}
		this.option = option
	}

	async get(key) {
		const res = await axios.request({
			method: 'GET',
			url: `${CACHE_URL}/${key}`,
			headers: this.option
		})

		const data = res.data
		if (data.status !== 200) {
			throw new Error(data)
		}
		return data.body
	}
}


