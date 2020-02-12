const {
  AUTH_FAILED,
  AUTH_TIMEOUT
} = require('./errors')
const jwt = require('jsonwebtoken')

const {
  JWT_SECRET
} = process.env

async function authentication (resolve, root, args, ctx, info) {
  const {
    req
  } = ctx
  let token = req.get('authorization')
  if (!token) {
    throw new AUTH_FAILED()
  }
  token = token.replace(/Bearer /, '')
  try {
    ctx.jwt = jwt.verify(token, JWT_SECRET)
  } catch (err) {
    throw new AUTH_FAILED()
  }
  if (ctx.jwt.expiresAt < Date.now()) {
    throw new AUTH_TIMEOUT()
  }

  // run the actual query, see graphql-middleware
  const result = await resolve(root, args, ctx, info)

  return result
}

// specify the queries / mutations we want to require authentication
module.exports = {
  Query: {
    NoOpQ: authentication,
    UserQ: authentication
  }
}
