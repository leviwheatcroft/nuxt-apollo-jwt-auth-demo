const gql = require('graphql-tag')
module.exports = gql`
  mutation UserLogin (
    $username: String!
    $password: String!
  ) {
    tokens: UserLoginM(
      username: $username
      password: $password
    ) {
      accessToken
      refreshToken
    }
  }
`
