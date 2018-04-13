var isLocal = require('./isLocal')
var getToken = require('./getToken')

module.exports = function monkeyPatchXHR (header, token) {
  var xhr = window.XMLHttpRequest.prototype
  var originalOpen = xhr.open

  window.XMLHttpRequest.prototype.open = function openWithCSRFToken (method, url) {
    var result = originalOpen.apply(this, arguments)
    token = token || getToken()
    if (isLocal(url) && token) this.setRequestHeader(header || 'x-csrf-token', token)
    return result
  }

  return function restore () {
    window.XMLHttpRequest.prototype.open = originalOpen
  }
}
