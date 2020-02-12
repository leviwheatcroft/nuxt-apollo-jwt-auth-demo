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
    this.$storage.setLocalStorage('refreshToken', refreshToken)
    this.$storage.setState('loggedIn', true)
    const $snotify = this.$auth.ctx.app.$snotify
    $snotify.clear()
    $snotify.info('Will Timeout...', 'accessToken', {
      timeout: accessTimeout
    })
    $snotify.info('Will Timeout...', 'refreshToken', {
      timeout: refreshTimeout
    })
  }

  _clearTokens () {
    this.$storage.removeLocalStorage('accessToken')
    this.$storage.removeLocalStorage('refreshToken')
    this.$storage.setState('loggedIn', false)
  }

  mounted () {
    return this.$auth.fetchUserOnce()
  }

  async login ({ email, password }) {
    // clear out any old tokens
    this._clearTokens()

    const apollo = this.$auth.ctx.app.apolloProvider.defaultClient

    // don't trap errors here, they will be thrown to the component
    const { data: { tokens } } = await apollo.mutate({
      mutation: this.gql.UserLoginM,
      variables: { email, password }
    })
    // debugger

    this._setTokens(tokens)

    return this.fetchUser()
  }

  async refresh () {
    const apollo = this.$auth.ctx.app.apolloProvider.defaultClient
    const refreshToken = this.$storage.getLocalStorage('refreshToken')
    // don't trap errors here, they will be thrown to the component
    const { data: { tokens } } = await apollo.mutate({
      mutation: this.gql.UserRefreshM,
      variables: { refreshToken }
    })

    this._setTokens(tokens)
  }

  async fetchUser (endpoint) {
    const apollo = this.$auth.ctx.app.apolloProvider.defaultClient
    // don't trap errors here, they will be thrown to the component
    const user = await apollo.query({
      query: this.gql.UserQ
    })

    this.$storage.setState('user', user)
  }

  logout (endpoint) {
    // no need to notify the server that we're logging out
    this._clearTokens()
  }
}
