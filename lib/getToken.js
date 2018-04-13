module.exports = function getCSRFToken () {
  var csrfTokenNode
  try {
    csrfTokenNode = document.head.querySelector('meta[name="csrf-token"]')
    if (csrfTokenNode) {
      if (csrfTokenNode.content) return csrfTokenNode.content
    }
  } catch (err) {}
}
