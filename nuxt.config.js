const UserQ = require('./plugins/auth/UserQ')
const UserLoginM = require('./plugins/auth/UserLoginM')
const UserRefreshM = require('./plugins/auth/UserRefreshM')

module.exports = {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    'vue-snotify/styles/material.css',
    '@assets/markdown.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/moment',
    '~/plugins/snotify'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  router: {
    middleware: ['auth']
  },
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    // Doc: https://github.com/nuxt-community/apollo-module
    '@nuxtjs/apollo',
    // Doc: https://github.com/nuxt-community/auth-module
    '@nuxtjs/auth'
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  },
  apollo: {
    clientConfigs: {
      default: '~/plugins/apollo/apolloConfig.js'
    }
    // defaultOptions: {
    //   $query: {
    //     errorPolicy: 'all'
    //   },
    //   query: { error: '~/plugins/apollo/errorHandler.js' },
    //   mutation: { error: '~/plugins/apollo/errorHandler.js' }
    // },
    // errorHandler: '~/plugins/apollo/errorHandler.js'
  },
  auth: {
    defaultStrategy: 'graphql',
    strategies: {
      graphql: {
        _name: 'graphql',
        _scheme: '~/plugins/auth/graphql.js',
        gql: {
          UserQ,
          UserLoginM,
          UserRefreshM
        }
      }
    }
  }
}
