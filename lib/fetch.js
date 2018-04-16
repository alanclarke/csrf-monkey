var isLocal = require('./isLocal')
var getToken = require('./getToken')

module.exports = function monkeyPatchFetch (header, token) {
  if (!window.fetch) return function noop () {}

  var originalFetch = window.fetch

  window.fetch = function fetchWithCSRFToken (url, options) {
    // if Request object passed in
    header = header || 'x-csrf-token'
    token = token || getToken()

    if (typeof url === 'string') {
      if (isLocal(url)) {
        options = options || {}
        options.headers = options.headers || {}
        options.headers[header] = token
      }
    }

    if (url instanceof window.Request) {
      var req = url
      if (isLocal(req.url)) req.headers.append(header, token)
    }

    return originalFetch(url, options)
  }

  return function restore () {
    window.fetch = originalFetch
  }
}
