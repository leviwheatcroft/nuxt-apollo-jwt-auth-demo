import Snotify from 'vue-snotify'
import Vue from 'vue'

export default function (ctx) {
  const {
    app
  } = ctx
  Vue.use(Snotify)

  app.$snotify = Vue.prototype.$snotify
}
