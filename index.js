var monkeyPatchFetch = require('./lib/fetch')
var monkeyPatchXHR = require('./lib/xhr')
var getToken = require('./lib/getToken')

module.exports = function csrfMonkey (header, token) {
  token = token || getToken()
  var restoreFetch = monkeyPatchFetch(header, token)
  var restoreXHR = monkeyPatchXHR(header, token)
  return function restore () {
    restoreFetch()
    restoreXHR()
  }
}
