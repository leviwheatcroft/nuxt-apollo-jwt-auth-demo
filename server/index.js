/* eslint-disable import/order */
const {
  ApolloServer
} = require('apollo-server-express')
const {
  makeExecutableSchema
} = require('graphql-tools')
const {
  applyMiddleware
} = require('graphql-middleware')
const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()

const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')
const middleware = require('./middleware')
const {
  formatError
} = require('apollo-errors')

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

async function start () {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // this setup is specific to graphql-middleware
  const schema = applyMiddleware(
    makeExecutableSchema({ typeDefs, resolvers }),
    middleware
  )

  // need access to the request in context so the auth middleware can read
  // authorization header
  const context = ({ req }) => ({ req })

  const server = new ApolloServer({
    context,
    schema,
    formatError
  })

  // instead of a stand alone server we're hooking the nuxt server, in a real
  // app you'd probably have a stand alone back end
  server.applyMiddleware({ app, path: '/graphql' })

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
