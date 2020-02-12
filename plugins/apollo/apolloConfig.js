/* eslint-disable */
import getRefreshTokenLink from './getRefreshTokenLink'

export default function (ctx) {
  return {
    link: getRefreshTokenLink(ctx),
    defaultHttpLink: true,
    httpEndpoint: 'http://localhost:3000/graphql',
    getAuth: () => {
      return `Bearer ${ctx.app.$auth.$storage.getLocalStorage('accessToken')}`
    },
  }
}
