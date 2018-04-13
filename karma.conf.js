const cors = require('cors')

module.exports = function (config) {
  config.set({
    frameworks: ['mocha', 'expressServer'],
    files: [ 'test/**/test-*' ],
    preprocessors: { 'test/**/test-*': ['webpack', 'sourcemap'] },
    webpack: {
      watch: true,
      devtool: 'inline-source-map',
      mode: 'development',
      module: {
        rules: [{
          test: /\.js$/,
          use: {
            loader: 'istanbul-instrumenter-loader'
          },
          exclude: /(test|node_modules|bower_components)\//
        }]
      }
    },
    webpackMiddleware: {
      stats: 'errors-only',
      logLevel: 'silent'
    },
    expressServer: {
      extensions: [function (app, log) {
        app.use(cors())
        app.get('/api/headers', function (req, res) {
          res.json(req.headers)
        })
      }]
    },
    browsers: ['Firefox'],
    reporters: [ 'progress', 'coverage-istanbul', 'coverage' ],
    coverageIstanbulReporter: {
      reports: [ 'text-summary' ],
      fixWebpackSourcePaths: true
    }
  })
}
