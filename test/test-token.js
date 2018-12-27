const aes = require('../src/helper/aes')
const {md5, uniqueid} = require('../src/helper/crypto')
const {MD5_SALT, AES_SALT} = require('../src/generic/config')

const userid = 1
const nonce = uniqueid(24)
const secret = md5(nonce, MD5_SALT)
const token = aes.encode(`id=${userid}&secret=${secret}`, AES_SALT)

// 4a80c600d863ff024dbda170, +gJTGNrJqm717HpQOHl5JJrNjS67XUMevkXbOpfHU9TdMWIIDNOoG3RldRkHdqad
console.log(nonce, token)

