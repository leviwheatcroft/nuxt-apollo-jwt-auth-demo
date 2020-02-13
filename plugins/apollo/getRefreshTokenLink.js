// https://gist.github.com/alfonmga/9602085094651c03cd2e270da9b2e3f7
// https://github.com/apollographql/apollo-link/issues/646#issuecomment-423279220

import { onError } from 'apollo-link-error'
import { Observable } from 'apollo-link'

let isFetchingToken = false
let tokenSubscribers = []
function subscribeTokenRefresh (cb) {
  tokenSubscribers.push(cb)
}
function onTokenRefreshed (err) {
  tokenSubscribers.map(cb => cb(err))
}

/* eslint-disable consistent-return */
export default function getRefreshAuthTokenLink (ctx, options) {
  return onError(({
    graphQLErrors,
    networkError,
    operation,
    response,
    forward
  }) => {
    const {
      app: {
        // apolloProvider: { defaultClient: $apollo },
        $auth,
        // router: $router,
        $snotify
      }
    } = ctx
    // eslint-disable-next-line require-await
    return new Observable(async (observer) => {
      if (graphQLErrors) {
        graphQLErrors.map(async ({ name, handled }, index) => {
          switch (name) {
            case 'AUTH_ACCESS_TIMEOUT': {
              const retryRequest = () => {
                const authorization =
                  `Bearer ${$auth.$storage.getLocalStorage('accessToken')}`
                operation.setContext({
                  headers: { ...headers, authorization }
                })

                const subscriber = {
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer)
                }

                return forward(operation).subscribe(subscriber)
              }

              const { headers } = operation.getContext()

              if (!isFetchingToken) {
                isFetchingToken = true

                try {
                  await $auth.strategy.refresh()

                  isFetchingToken = false
                  onTokenRefreshed(null)
                  tokenSubscribers = []

                  return retryRequest()
                } catch (error) {
                  error.handled = true
                  onTokenRefreshed(error)

                  tokenSubscribers = []
                  isFetchingToken = false

                  await $auth.strategy.logout()
                  return observer.error(graphQLErrors[index])
                }
              }

              const tokenSubscriber = new Promise((resolve) => {
                subscribeTokenRefresh((errRefreshing) => {
                  if (!errRefreshing) { return resolve(retryRequest()) }
                })
              })

              return tokenSubscriber
            }
            case 'AUTH_REFRESH_TIMEOUT': {
              if (!handled)
                $auth.strategy.logout('refresh token expired')
              response.errors = undefined
              return observer.next(response)
            }
            case 'AUTH_FAILED': {
              $snotify.add($snotify.info(
                'You\'ve been logged out (no access / refresh token).',
                'Logged Out',
                { timeout: 10000 }
              ))
              response.errors = undefined
              return observer.next(response)
            }
            default:
              return observer.next(response)
          }
        })
      }

      if (networkError) {
        return observer.error(networkError)
      }
    })
  })
}
