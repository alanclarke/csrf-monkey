/* globals describe it */
var isLocal = require('../lib/isLocal')
var expect = require('expect.js')

describe('is local', function () {
  it('should return true when local', function () {
    expect(isLocal('./some/local/path')).to.eql(true)
    expect(isLocal('/some/local/path')).to.eql(true)
    expect(isLocal('http://localhost:9876/some/local/path')).to.eql(true)
    expect(isLocal('http://localhost:9876')).to.eql(true)
  })

  it('should return false when not local', function () {
    expect(isLocal('http://example.com/some/local/path')).to.eql(false)
    expect(isLocal('http://localhost:9877')).to.eql(false)
  })
})
