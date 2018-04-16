var isLocal = require('./isLocal')
var getToken = require('./getToken')

module.exports = function monkeyPatchFetch (header, token) {
  if (!window.fetch) return function noop () {}

  var originalFetch = window.fetch

  window.fetch = function fetchWithCSRFToken (url, options) {
    // if Request object passed in
    token = token || getToken()
    if (typeof url === 'string') {
      if (isLocal(url) && token) {
        options = options || {}
        options.headers = options.headers || {}
        options.headers[header || 'x-csrf-token'] = token
      }
      return originalFetch(url, options)
    } else if (url instanceof window.Request) {
      var req = url
      if (isLocal(req.url) && token) {
        options = options || {}
        req.headers.append(header || 'x-csrf-token', token)
      }
      return originalFetch(req, options)
    }
  }

  return function restore () {
    window.fetch = originalFetch
  }
}
