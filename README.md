## Nuxt Apollo GraphQL JWT Auth Demo

After spending days tripping over Auth & JWT I thought I'd make a demo / sandbox to make it easier to try out different things.

 - Check it out on [codesandbox.io]()
 - @levi on the [nuxt discord](https://discord.nuxtjs.org/)
 - post an issue on [github]()

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

Usually you'd need to provide a username and password, but we're not concerned with anything so pedestrian. We simply issue a LoginMutation and the server happily issues us an `accessToken` & `requestToken`.

The client stores these tokens for later user. Presently this repo uses local storage. If you need SSR then you'll need to look into using cookies instead so the server has the tokens when it's trying to render. The auth module's `local` scheme demonstrates how to store the tokens as cookies.

### Why such a quick timeout?

For this demo tokens time out very quickly so you can play around with the different states in real time. You can change the time out duration in .env.

## Send Query

The nuxt apollo module will attach the `accessToken` to any queries or mutations as an `Authorization` http request header.

Server middleware checks whether the `accessToken` has expired. If it hasn't, the request is served and nothing additional happens with tokens during this request.

If the token has expired, we issue an `AUTH_EXPIRED` error, and something terrible and awesome ensues. The custom `refreshTokenLink` intercepts the error, requests new tokens using the `refreshToken`, and then re-issues the original request. This might seem like a simple idea, but apollo links are inscrutable, esoteric, and arcane.

## Logout
Not much to see here. We don't even bother to tell the server, just delete the tokens from local storage and go about your day.
