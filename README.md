## Nuxt Apollo GraphQL JWT Auth Demo

### Overview

After spending days tripping over Auth & JWT I thought I'd make a demo / sandbox to make it easier to try out different things.

 - Check it out on [codesandbox.io]()
 - @levi on the [nuxt discord](https://discord.nuxtjs.org/)
 - post an issue on [github]()

Log in and fire off a few queries to watch the JWT refresh magic.

This repo is focused on the mechanics of Apollo & JWT Auth, so there's no database or user management going on.

Included:

 - nuxt apollo module config
 - nuxt auth module config
 - graphql based auth, with auth module scheme
 - refresh tokens, with apollo link

Excluded:

 - SSR support

## JWT Overview

### Crash Course

A JSON web token is a Base64 encoded payload allowing a client to identify itself to a server. The token is typically passed to the server as a header on every request. The payload content can be read by the client, but can not be modified.

Servers typically issue an `accessToken` which establishes authorisations for a few minutes, as well as a `refreshToken` which the client can exchange for new tokens. The `accessToken` simply means that authorisation doesn't need to be established on every single request. The `refreshToken` allows the server to re-establish authorisation from time to time without requiring the user to login again.

### Required Reading

 - [Prisma's Guide](https://www.prisma.io/tutorials/graphql-rest-authentication-authorization-basics-ct20) is a nice primer.
 - [Auth0's Guide](https://auth0.com/learn/json-web-tokens/) is a nice, terse, overview.

## Login

We issue a Login Mutation and the server issues an `accessToken` & `requestToken`.

The client stores these tokens for later user. Presently this repo uses local storage. If you need SSR then you'll need to look into using cookies instead so the server has the tokens when it's trying to render. The auth module's `local` scheme demonstrates how to store the tokens as cookies.

### Why such a quick timeout?

For this demo tokens time out very quickly so you can play around with the different states in real time. You can change the time out duration in .env.

## Send Query

The nuxt apollo module will attach the `accessToken` to any queries or mutations as an `Authorization` http request header.

Server middleware checks whether the `accessToken` has expired. If it hasn't, the request is served and nothing additional happens with tokens during this request.

If the token has expired, we issue an `AUTH_ACCESS_TIMEOUT` error, and something terrible and awesome ensues. The custom Apollo Link intercepts the error, requests new tokens using the `refreshToken`, and then re-issues the original request. This might seem like a simple idea, but apollo links are inscrutable, esoteric, and arcane.

## Logout
Not much to see here. We don't even bother to tell the server, just delete the tokens from local storage and go about your day.

## Error Handling

Error management in apollo [is a little unusual](https://www.apollographql.com/docs/react/data/error-handling/). Basically, by setting `errorPolicy: 'all'` on our queries, apollo will return an errors property as part of the response instead of throwing an error. The handlers defined in `plugins/apollo/apolloConfig.js` can direct the user to log in or whatever, but you still need a graceful resolution to the action that made the client realise it was logged out. In practice, this just means being aware that the `data` property of a response will be null (and there will be an errors property) when a user has been logged out.

For example, destructuring your response like this will throw an error if `data` is `null`.

```
async issueSomeQuery () {
  const {
    data: {
      someQuery: { someProperty }
    }
  } = await this.$apollo.query({
    query: SomeQuery,
    fetchPolicy: 'network-only'
  })
}
```

see also:

 - [full stack error handling with graphql apollo](https://blog.apollographql.com/full-stack-error-handling-with-graphql-apollo-5c12da407210)
