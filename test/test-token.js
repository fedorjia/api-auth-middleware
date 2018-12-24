const aes = require('../src/helper/aes')
const {md5} = require('../src/helper/crypto')

const userid = 1
const password = 'e10adc3949ba59abbe56e057f20f883e'
const key = '~F85or23d.cn@#$~'

const secret = md5(password)
const token = aes.encode(`${userid},${secret}`, key)

console.log(secret, token)

