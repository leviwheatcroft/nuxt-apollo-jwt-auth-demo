const gql = require('graphql-tag')
module.exports = gql`
  type User {
    email: String!
  }
  scalar Token
  type Tokens {
    accessToken: Token!
    refreshToken: Token!
  }

  type Query {
    UserQ: User!
    NoOpNonAdminQ: Boolean!
    NoOpAdminQ: Boolean!
  }
  type Mutation {
    UserLoginM(
      email: String!
      password: String!
    ): Tokens!
    UserRefreshM(
      refreshToken: Token!
    ): Tokens!
  }
`
