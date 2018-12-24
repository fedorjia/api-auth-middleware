const {connect} = require("../src/helper/redis")

const redisConfig = {
	/*
	 * command:
	 * 	redis-cli -h 127.0.0.1 -p 9501 -a 'ak89w3M483)#4db(root)'
	 */
	host: '127.0.0.1',
	port: 9501,
	password: 'ak89w3M483)#4db(root)',
	expire: 7200, // 2 hours
	opts: {
		db: 0
	}
}

const userid = 1001
const password = 'qwer1234'

connect(redisConfig).then(() => {
	redisClient.set('user:' + userid, JSON.stringify({
		'id': userid,
		'password': password,
		'username': '18710229859',
		"permissions": ['user:list', 'user:add']
	}))
	console.log('OK')
})