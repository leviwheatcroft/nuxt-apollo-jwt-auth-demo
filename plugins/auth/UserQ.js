const gql = require('graphql-tag')
module.exports = gql`
  query User {
    user: UserQ {
      email
    }
  }
`
