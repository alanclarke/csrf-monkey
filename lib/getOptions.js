var getToken = require('./getToken')
module.exports = function getOptions (options) {
  return {
    header: options.header || 'x-csrf-token',
    token: getToken()
  }
}
