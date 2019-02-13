/**
 * is url excluded
 */
const defaults = ['/favicon.ico']

exports.isExclude = function(excludes, url) {
	excludes = excludes.concat(defaults)

	let is = false
	for (let exclude of excludes) {
		if (url === '/' || url.startsWith(exclude)) {
			is = true
			break
		}
	}
	return is
}