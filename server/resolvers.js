/* eslint-disable import/order */
require('dotenv').config()
const {
  GraphQLScalarType
} = require('graphql')
const jwt = require('jsonwebtoken')
const {
  getTokens
} = require('./jwt')
const {
  AUTH_TIMEOUT
} = require('./errors')
const {
  omit
} = require('lodash')

const users = {
  ordinaryUser: {
    username: 'ordinaryUser',
    email: 'ordinaryUser@gmail.com',
    grants: {
      basic: true,
      admin: false
    }
  },
  adminUser: {
    username: 'adminUser',
    email: 'adminUser@gmail.com',
    grants: {
      basic: true,
      admin: true
    }
  }
}

const {
  JWT_SECRET
} = process.env

module.exports = {
  // I honestly don't know if this is a good idea or not
  // defining a type & resolver for tokens it means you don't need to
  // verify / sign them in other resolvers
  // if you wanted to store private keys for refresh tokens in your db then
  // this approach would be impractical
  Token: new GraphQLScalarType({
    name: 'Token',
    description: 'Custom Token Scalar',
    serialize: value => jwt.sign(value, JWT_SECRET),
    parseValue: value => jwt.verify(value, JWT_SECRET),
    parseLiteral: value => jwt.verify(value, JWT_SECRET)
  }),
  Query: {
    UserQ: (_, { username }) => {
      return omit(users[username], 'grants')
    },
    NoOpNonAdminQ: () => true,
    NoOpAdminQ: () => true
  },
  Mutation: {
    UserLoginM: (_, { username }) => {
      getTokens(users.username)
    },
    UserRefreshM: (_, query) => {
      const {
        refreshToken: { expiresAt, username }
      } = query
      if (expiresAt < Date.now()) { throw AUTH_TIMEOUT() }
      return getTokens(users[username])
    }
  }
}
