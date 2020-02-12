const {
  createError
} = require('apollo-errors')

module.exports.AUTH_FAILED = createError('AUTH_FAILED', {
  message: 'auth failed - token not provided or failed verification'
})
module.exports.AUTH_TIMEOUT = createError('AUTH_TIMEOUT', {
  message: 'auth failed - token expired'
})
