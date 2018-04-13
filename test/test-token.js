/* globals describe afterEach it */
var getToken = require('../lib/getToken')
var expect = require('expect.js')

describe('get token', function () {
  var meta
  afterEach(function () {
    if (meta && meta.parentElement) meta.parentElement.removeChild(meta)
    meta = null
  })

  it('should return token when one is specified in a meta tag', function () {
    meta = document.createElement('meta')
    meta.name = 'csrf-token'
    meta.content = 'token'
    document.head.appendChild(meta)
    expect(getToken()).to.eql('token')
  })

  it('should return token when one is specified in a meta tag', function () {
    meta = document.createElement('meta')
    meta.name = 'csrf-token'
    document.head.appendChild(meta)
    expect(getToken()).to.eql(void 0)
  })

  it('should return nothing when there is no csrf meta tag', function () {
    expect(getToken()).to.eql(void 0)
  })
})
