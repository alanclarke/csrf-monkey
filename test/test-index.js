/* globals describe beforeEach afterEach it fetch */
var patchLoader = require('inject-loader!../index') // eslint-disable-line
var fetchPatchLoader = require('inject-loader!../lib/fetch') // eslint-disable-line
var xhrPatchLoader = require('inject-loader!../lib/xhr') // eslint-disable-line
var axios = require('axios')
var expect = require('expect.js')

describe.skip('csrf-monkey', function () {
  var patch, restore, meta

  beforeEach(function () {
    meta = document.createElement('meta')
    meta.name = 'csrf-token'
    meta.content = 'meta-token'
    document.head.appendChild(meta)
  })

  afterEach(function () {
    if (meta && meta.parentElement) meta.parentElement.removeChild(meta)
  })

  describe('when url is local', function () {
    beforeEach(function () {
      patch = createMonkey(true)
    })

    afterEach(function () {
      restore()
    })

    describe('fetch', function () {
      it('should add the token to the header', function () {
        restore = patch('header', 'token')
        return fetch('http://localhost:9877/api/headers?' + Math.random())
          .then(response => response.json())
          .then(function (resp) {
            expect(resp.header).to.eql('token')
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
          return fetch('http://localhost:9877/api/headers?' + Math.random())
            .then(response => response.json())
            .then(function (resp) {
              expect(resp.header).to.eql(void 0)
            })
        })
      })
    })

    describe('xhr', function () {
      it('should add the token to the header', function () {
        restore = patch('header', 'token')
        return axios.get('http://localhost:9877/api/headers?' + Math.random())
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

      describe('after restoring', function () {
        it('should not add the token to the header', function () {
          restore = patch('header', 'token')
          restore()
          return axios.get('http://localhost:9877/api/headers?' + Math.random())
            .then(function (resp) {
              expect(resp.data.header).to.eql(void 0)
            })
        })
      })
    })
  })

  describe('when url is not local', function () {
    beforeEach(function () {
      patch = createMonkey(false)
    })

    describe('fetch', function () {
      it('should not add the token to the header', function () {
        restore = patch('header', 'token')
        return fetch('http://localhost:9877/api/headers?' + Math.random())
          .then(response => response.json())
          .then(function (resp) {
            expect(resp.header).to.eql(void 0)
          })
      })
    })

    describe('xhr', function () {
      it('should not add the token to the header', function () {
        restore = patch('header', 'token')
        return axios.get('http://localhost:9877/api/headers?' + Math.random())
          .then(function (resp) {
            expect(resp.data.header).to.eql(void 0)
          })
      })
    })
  })
})

function createMonkey (isLocal) {
  return patchLoader({
    './lib/xhr': xhrPatchLoader({
      './isLocal': function () {
        return isLocal
      }
    }),
    './lib/fetch': fetchPatchLoader({
      './isLocal': function () {
        return isLocal
      }
    })
  })
}
