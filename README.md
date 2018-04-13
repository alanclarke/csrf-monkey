[![Travis CI](https://travis-ci.org/alanclarke/csrf-monkey.svg?branch=master)](https://travis-ci.org/alanclarke/csrf-monkey)
[![devDependency Status](https://david-dm.org/alanclarke/csrf-monkey/dev-status.svg)](https://david-dm.org/alanclarke/csrf-monkey#info=devDependencies)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

# csrf-monkey
Clientside csrf made simple

- configurable, testable and restorable
- handles both xhr and fetch
- 100% test coverage

## Installation
```js
npm install --save csrf-monkey
```

## Usage

Default behaviour

Put your csrf token in a meta tag in your head like so:

```html
<html>
  <head>
    <meta name='csrf-token' content='value'>
  </head>
  <body></body>
</html>
```

Then call `csrf-monkey` to patch xhr and window.fetch to automatically include the csrf token in all requests

```js
var axios = require('axios')
var csrfMonkey = require('csrf-monkey')
csrfMonkey()


fetch('/api') // request will include csrf header ('x-csrf-token': value)
axios.get('/api') // request will include csrf header ('x-csrf-token': value)
```


## Options

```js
// csrfMonkey(header, token)

// you can also pass a custom header to csrf-monkey:
csrfMonkey('my-custom-csrf-header')

// and you can pass your csrf token value directly to csrf-monkey if you don't want to include it as a meta tag:
csrfMonkey('my-custom-csrf-header', 'my-csrf-token')

```

## Restore

```js
var restore = csrfMonkey()
restore() // Restores everything back to how it was
```


## Credits
- Inspired by `csrf-xhr`
