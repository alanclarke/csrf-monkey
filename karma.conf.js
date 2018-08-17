const cors = require('cors')
const path = require('path')

module.exports = function (config) {
  config.set({
    frameworks: [ 'mocha', 'expressServer' ],
    files: [ 'test/test-*' ],
    preprocessors: {
      '/**/*.js': [ 'webpack', 'sourcemap' ]
    },
    webpack: {
      module: {
        rules: [
          {
            test: /\.js$/,
            use: { loader: 'istanbul-instrumenter-loader' },
            include: path.resolve('lib/')
          }
        ]
      }
    },
    expressServer: {
      extensions: [function (app, log) {
        app.use(cors())
        app.get('/api/headers', function (req, res) {
          res.json(req.headers)
        })
      }]
    },
    webpackMiddleware: { stats: 'errors-only', logLevel: 'error' },
    browsers: [ 'Firefox' ],
    reporters: [ 'progress', 'coverage', 'coveralls' ],
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/',
      reporters: [ { type: 'html' }, { type: 'text-summary' } ]
    }
  })
}
