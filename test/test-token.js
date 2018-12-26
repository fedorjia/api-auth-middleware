const aes = require('../src/helper/aes')
const {md5} = require('../src/helper/crypto')
const {MD5_SALT, AES_SALT} = require('../src/generic/config')

const userid = 1
const password = '#Dfds#$$533'

const secret = md5(password, MD5_SALT)
const token = aes.encode(`${userid},${secret}`, AES_SALT)

// 1+680btmwiJ98uVGzLwuC/S7zfYJDY2LY6t1QhdziEcOCpKNMEZGZtQqV04MBL+k
console.log(token)

