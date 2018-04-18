/* globals describe beforeEach afterEach it fetch Request */
var patchLoader = require('inject-loader!../lib/fetch') // eslint-disable-line
var expect = require('expect.js')

describe.skip('fetch', function () {
  var patch, restore, meta

  describe('when url is local', function () {
    beforeEach(function () {
      meta = document.createElement('meta')
      meta.name = 'csrf-token'
      meta.content = 'meta-token'
      document.head.appendChild(meta)
      patch = patchLoader({
        './isLocal': function () { return true }
      })
    })

    afterEach(function () {
      if (meta && meta.parentElement) meta.parentElement.removeChild(meta)
      restore()
    })

    it('should add the token to the header', function () {
      restore = patch('header', 'token')
      return fetch('http://localhost:9877/api/headers')
        .then(response => response.json())
        .then(function (resp) {
          expect(resp.header).to.eql('token')
        })
    })

    it('should work with Request object', function () {
      restore = patch('header', 'token')
      var req = new Request('http://localhost:9877/api/headers')
      return fetch(req)
        .then(response => response.json())
        .then(function (resp) {
          expect(resp.header).to.eql('token')
        })
    })

    it('should default to x-csrf-token', function () {
      restore = patch()
      return fetch('http://localhost:9877/api/headers?' + Math.random())
        .then(response => response.json())
        .then(function (resp) {
          expect(resp['x-csrf-token']).to.eql('meta-token')
        })
    })

    it('should detect tokens in meta tags', function () {
      restore = patch('header')
      return fetch('http://localhost:9877/api/headers?' + Math.random())
        .then(response => response.json())
        .then(function (resp) {
          expect(resp.header).to.eql('meta-token')
        })
    })

    describe('after restoring', function () {
      it('should not add the token to the header', function () {
        restore = patch('header', 'token')
        restore()
        return fetch('http://localhost:9877/api/headers')
          .then(response => response.json())
          .then(function (resp) {
            expect(resp.header).to.eql(void 0)
          })
      })
    })
  })

  describe('when url is not local', function () {
    beforeEach(function () {
      patch = patchLoader({
        './isLocal': function () { return false }
      })
    })

    it('should not add the token to the header', function () {
      restore = patch('header', 'token')
      return fetch('http://localhost:9877/api/headers')
        .then(response => response.json())
        .then(function (resp) {
          expect(resp.header).to.eql(void 0)
        })
    })

    it('should not add the token to the header with Request object', function () {
      restore = patch('header', 'token')
      var req = new Request('http://localhost:9877/api/headers')
      return fetch(req)
        .then(response => response.json())
        .then(function (resp) {
          expect(resp.header).to.eql(void 0)
        })
    })
  })

  describe('when window.fetch does not exist', function () {
    var originalFetch
    beforeEach(function () {
      originalFetch = window.fetch
      delete window.fetch
      patch = patchLoader({
        './isLocal': function () { return true }
      })
    })

    afterEach(function () {
      window.fetch = originalFetch
    })

    it('should not add the token to the header', function () {
      restore = patch('header', 'token')
      return originalFetch('http://localhost:9877/api/headers')
        .then(response => response.json())
        .then(function (resp) {
          expect(resp.header).to.eql(void 0)
          restore()
        })
    })
  })
})
