import getErrorLink from './getErrorLink'

export default function (ctx) {
  const refreshHandlers = {
    AUTH_ACCESS_TIMEOUT () {
      return ctx.app.$auth.strategy.refresh()
    }
  }
  const errorHandlers = {
    AUTH_REFRESH_TIMEOUT () {
      ctx.app.$auth.strategy.logout('refresh token expired')
    },
    AUTH_FAILED () {
      ctx.app.$auth.strategy.logout('no access / refresh token')
    },
    UNAUTHORIZED () {
      ctx.app.$snotify.warning('You\'re not authorized to do that')
    }
  }
  function getAuth () {
    return `Bearer ${ctx.app.$auth.$storage.getLocalStorage('accessToken')}`
  }
  const link = getErrorLink({
    ctx,
    getAuth,
    refreshHandlers,
    errorHandlers
  })
  return {
    link,
    defaultHttpLink: true,
    httpEndpoint: 'http://localhost:3000/graphql',
    getAuth,
    apollo: {
      defaultOptions: {
        query: {
          errorPolicy: 'all'
        }
      }
    }
  }
}
