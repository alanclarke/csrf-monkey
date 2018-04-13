module.exports = function isLocal (url) {
  var absoluteUrl = /^(?:[a-z]+:)?\/\//i
  var origin = window.location.href.replace(/([^/])[/][^/].*/, '$1')
  return url.indexOf(origin) === 0 || !absoluteUrl.test(url)
}
