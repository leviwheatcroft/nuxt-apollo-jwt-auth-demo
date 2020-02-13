const gql = require('graphql-tag')
module.exports = gql`
  type User {
    username: String!
    email: String!
    grants: Grants
  }
  type Grants {
    basic: Boolean
    admin: Boolean
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
      username: String!
      password: String!
    ): Tokens!
    UserRefreshM(
      refreshToken: Token!
    ): Tokens!
  }
`
