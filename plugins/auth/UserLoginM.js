const gql = require('graphql-tag')
module.exports = gql`
  mutation UserLogin (
    $email: String!
    $password: String!
  ) {
    tokens: UserLoginM(
      email: $email
      password: $password
    ) {
      accessToken
      refreshToken
    }
  }
`
