import {
  decode
} from 'jsonwebtoken'
const accessTimeout = process.env.JWT_ACCESS_TOKEN_EXPIRY
const refreshTimeout = process.env.JWT_REFRESH_TOKEN_EXPIRY

export default class GraphQLScheme {
  constructor (auth, options) {
    this.$auth = auth
    this.$storage = auth.$storage
    this.name = 'graphql'
    this.gql = options.gql
  }

  _setTokens (tokens) {
    const { accessToken, refreshToken } = tokens

    this.$storage.setLocalStorage('accessToken', accessToken)
    this.$storage.setState(
      'accessTokenExpiresAt',
      decode(accessToken).expiresAt
    )

    this.$storage.setLocalStorage('refreshToken', refreshToken)
    this.$storage.setState(
      'refreshTokenExpiresAt',
      decode(refreshToken).expiresAt
    )
    this.$storage.setState('loggedIn', true)
    const $snotify = this.$auth.ctx.app.$snotify
    $snotify.clear()
    $snotify.info('Will Timeout...', 'accessToken', {
      timeout: accessTimeout,
      showProgressBar: true
    })
    $snotify.info('Will Timeout...', 'refreshToken', {
      timeout: refreshTimeout,
      showProgressBar: true
    })
  }

  _clearTokens (reason) {
    this.$storage.removeLocalStorage('accessToken')
    this.$storage.removeLocalStorage('refreshToken')
    this.$storage.setState('loggedIn', false)
    const $snotify = this.$auth.ctx.app.$snotify
    $snotify.clear()
    if (!reason) return
    $snotify.info(`You've been logged out. (${reason})`, 'Logged Out', {
      progress: false,
      timeout: accessTimeout
    })
  }

  mounted () {
    return this.$auth.fetchUserOnce()
  }

  async login (variables) {
    // clear out any old tokens
    this._clearTokens()

    const apollo = this.$auth.ctx.app.apolloProvider.defaultClient

    const { data, errors } = await apollo.mutate({
      mutation: this.gql.UserLoginM,
      variables
    })
    if (errors) throw new Error(errors)
    this._setTokens(data.tokens)
    return this.fetchUser()
  }

  async refresh () {
    const apollo = this.$auth.ctx.app.apolloProvider.defaultClient
    const refreshToken = this.$storage.getLocalStorage('refreshToken')
    const { data, errors } = await apollo.mutate({
      mutation: this.gql.UserRefreshM,
      variables: { refreshToken },
      // although errorPolicy: 'all' is set in defaultConfig, that doesn't
      // seem to be applied to defaultClient ?!
      errorPolicy: 'all'
    })
    if (errors) return { errors }

    this._setTokens(data.tokens)
    return {}
  }

  async fetchUser (endpoint) {
    if (!this.$storage.getState('loggedIn')) {
      return
    }
    const apollo = this.$auth.ctx.app.apolloProvider.defaultClient
    const user = await apollo.query({
      query: this.gql.UserQ,
      errorPolicy: 'all'
    })

    this.$storage.setState('user', user)
  }

  logout (reason) {
    // no need to notify the server that we're logging out
    this._clearTokens(reason)
  }
}
