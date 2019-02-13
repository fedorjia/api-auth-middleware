/**
 * is url matched
 */
exports.match = function(urls, url) {
	let is = false
	for (let item of urls) {
		if (url === '/' || url.startsWith(item)) {
			is = true
			break
		}
	}
	return is
}