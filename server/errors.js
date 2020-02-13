const {
  createError
} = require('apollo-errors')

module.exports = {
  AUTH_FAILED: createError('AUTH_FAILED', {
    message: 'auth failed - token not provided or failed verification'
  }),
  AUTH_ACCESS_TIMEOUT: createError('AUTH_ACCESS_TIMEOUT', {
    message: 'auth failed - access token expired'
  }),
  AUTH_REFRESH_TIMEOUT: createError('AUTH_REFRESH_TIMEOUT', {
    message: 'auth failed - refresh token expired'
  }),
  UNAUTHORIZED: createError('UNAUTHORIZED', {
    message: 'unauthorized to perform action'
  })
}
