import Snotify from 'vue-snotify'
import Vue from 'vue'

export default function (ctx) {
  const {
    app
  } = ctx
  Vue.use(Snotify, {
    toast: {
      timeout: 3500,
      showProgressBar: false
    }
  })

  app.$snotify = Vue.prototype.$snotify
  // Vue.$snotify = Vue.prototype.$snotify
}
