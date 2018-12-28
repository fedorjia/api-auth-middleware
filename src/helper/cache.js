const axios = require('axios')

const axiosInstance = axios.create({
	timeout: 6000,
})

class Cache {
	constructor() {
		this.option = {
			url: 'http://localhost:4501'
		}
	}

	enable(option) {
		if (!option) {
			throw new Error('cache constructor init error')
		}
		if (!option.appid) {
			throw new Error('appid required in cache constructor')
		}
		if (!option.appsecret) {
			throw new Error('appsecret required in cache constructor')
		}
		Object.assign(this.option, option)
	}

	enabled() {
		return this.option['appid'] && this.option['appsecret']
	}

	async get(key) {
		const res = await axiosInstance.request({
			method: 'GET',
			url: `${this.option.url}/get/${key}`,
			headers: this.option
		})

		const data = res.data
		if (data.status !== 200) {
			throw new Error(data.message)
		}
		return data.body
	}

	async set(key, value) {
		const res = await axiosInstance.request({
			method: 'POST',
			url: `${this.option.url}/set`,
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

