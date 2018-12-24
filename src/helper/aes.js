const crypto = require('crypto')

/**
 * AES aes-128-ecb
 */
module.exports = {

	/** AES encode, secret length should be 16 */
	encode(str, key) {
        const iv = ''
        const clearEncoding = 'utf8'
        const cipherEncoding = 'base64'
        const cipherChunks = []
        const cipher = crypto.createCipheriv('aes-128-ecb', key, iv)
        cipher.setAutoPadding(true)
        cipherChunks.push(cipher.update(str, clearEncoding, cipherEncoding))
        cipherChunks.push(cipher.final(cipherEncoding))
        return cipherChunks.join('')
	},

	/** AES decode, secret length should be 16 */
	decode(str, key) {
        const iv = ''
        const clearEncoding = 'utf8'
        const cipherEncoding = 'base64'
        const cipherChunks = []
        const decipher = crypto.createDecipheriv('aes-128-ecb', key, iv)
        decipher.setAutoPadding(true)
        cipherChunks.push(decipher.update(str, cipherEncoding, clearEncoding))
        cipherChunks.push(decipher.final(clearEncoding))
        return cipherChunks.join('')
	}
}
