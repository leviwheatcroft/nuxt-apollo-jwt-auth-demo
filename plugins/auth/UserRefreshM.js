const gql = require('graphql-tag')
module.exports = gql`
  mutation UserRefresh (
    $refreshToken: Token!
  ) {
    tokens: UserRefreshM(
      refreshToken: $refreshToken
    ) {
      accessToken
      refreshToken
    }
  }
`
