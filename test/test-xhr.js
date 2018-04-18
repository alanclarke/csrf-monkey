/* globals describe beforeEach afterEach it */
var patchLoader = require('inject-loader!../lib/xhr') // eslint-disable-line
var axios = require('axios')
var expect = require('expect.js')

describe.skip('xhr', function () {
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
      return axios.get('http://localhost:9877/api/headers')
        .then(function (resp) {
          expect(resp.data.header).to.eql('token')
        })
    })

    it('should detect tokens in meta tags', function () {
      restore = patch('header')
      return axios.get('http://localhost:9877/api/headers?' + Math.random())
        .then(function (resp) {
          expect(resp.data.header).to.eql('meta-token')
        })
    })

    it('should default to x-csrf-token', function () {
      restore = patch()
      return axios.get('http://localhost:9877/api/headers?' + Math.random())
        .then(function (resp) {
          expect(resp.data['x-csrf-token']).to.eql('meta-token')
        })
    })

    describe('after restoring', function () {
      it('should not add the token to the header', function () {
        restore = patch('header', 'token')
        restore()
        return axios.get('http://localhost:9877/api/headers')
          .then(function (resp) {
            expect(resp.data.header).to.eql(void 0)
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
      return axios.get('http://localhost:9877/api/headers')
        .then(function (resp) {
          expect(resp.data.header).to.eql(void 0)
        })
    })
  })
})
