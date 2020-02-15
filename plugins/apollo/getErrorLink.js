// https://gist.github.com/alfonmga/9602085094651c03cd2e270da9b2e3f7
// https://github.com/apollographql/apollo-link/issues/646#issuecomment-423279220

import { onError } from 'apollo-link-error'
import { Observable } from 'apollo-link'

export default function getRefreshAuthTokenLink (options) {
  const refreshAuthTokenLink = onError(({
    graphQLErrors,
    networkError,
    operation,
    response,
    forward
  }) => {
    const {
      ctx,
      getAuth,
      refreshHandlers
    } = options
    const apollo = ctx.app.apolloProvider.defaultClient

    if (!graphQLErrors) return
    const error = graphQLErrors.find(e => refreshHandlers[e.name])
    if (!error) return

    return new Observable((observer) => {
      if (!apollo.refreshingToken) {
        apollo.refreshingToken = true
        apollo.refreshHandler = refreshHandlers[error.name]()
          .then(({ errors }) => {
            // because errorPolicy: 'all' refreshHandler ought not throw,
            // but return errors in the error property instead.
            // the only error present here should be AUTH_REFRESH_TIMEOUT
            // pass that back to the waiting requests so they can return that
            // instead of AUTH_ACCESS_TIMEOUT
            apollo.refreshingToken = false
            return { errors }
          })
      }
      apollo.refreshHandler
        .then(({ errors }) => {
          if (errors) {
            // error refreshing token, replace original error with refresh
            // token error, and allow that request to complete normally,
            // passing the refresh error back to the ui
            response.errors = errors
            return observer.next(response)
          }
          // successfully obtained new token, so update the auth header and
          // resend the original query
          const { headers } = operation.getContext()
          const authorization = getAuth()
          operation.setContext({ headers: { ...headers, authorization } })
          forward(operation).subscribe(observer)
        })
    })
  })

  const authErrorHandlingLink = onError(({
    graphQLErrors,
    operation,
    response
  }) => {
    const {
      errorHandlers
    } = options

    if (!graphQLErrors) return
    const error = graphQLErrors.find(e => errorHandlers[e.name])
    if (!error) return

    return new Observable(async (observer) => {
      await errorHandlers[error.name]()
      observer.next(response)
    })
  })

  return refreshAuthTokenLink.concat(authErrorHandlingLink)
}
