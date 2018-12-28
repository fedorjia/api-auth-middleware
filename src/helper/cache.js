const axios = require('axios')

const CACHE_URL = 'http://localhost:4501'

class Cache {
	constructor() {
		this.option = {}
	}

	setup(option) {
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

	enabled() {
		return this.option['appid'] && this.option['appsecret']
	}

	async get(key) {
		const res = await axios.request({
			method: 'GET',
			url: `${CACHE_URL}/get/${key}`,
			headers: this.option
		})

		const data = res.data
		if (data.status !== 200) {
			throw new Error(data.message)
		}
		return data.body
	}
	
	async set(key, value) {
		const res = await axios.request({
			method: 'POST',
			url: `${CACHE_URL}/set`,
			data: {
				key,
				value
			},
			headers: this.option
		})

		const data = res.data
		if (data.status !== 200) {
			throw new Error(data.message)
		}
		return data.body
	}
}

module.exports = new Cache()

