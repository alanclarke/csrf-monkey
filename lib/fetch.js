var isLocal = require('./isLocal')
var getToken = require('./getToken')

module.exports = function monkeyPatchFetch (header, token) {
  if (!window.fetch) return function noop () {}

  var originalFetch = window.fetch

  window.fetch = function fetchWithCSRFToken (url, options) {
    token = token || getToken()
    if (isLocal(url) && token) {
      options = options || {}
      options.headers = options.headers || {}
      options.headers[header || 'x-csrf-token'] = token
    }
    return originalFetch(url, options)
  }

  return function restore () {
    window.fetch = originalFetch
  }
}
