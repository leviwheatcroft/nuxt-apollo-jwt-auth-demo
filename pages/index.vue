<template lang="pug">
  .container
    .row.mt-3
      .col-12
        h1 nuxt graphql jwt auth demo
    .row.mt-3
      .col-12
        h4 try it out
        .links
          b-button.mr-3(
            @click="login"
          ) Login
          b-button.mr-3(
            @click="sendQuery"
          ) Send Query
          b-button(
            @click="logout"
          ) Logout
    .row.mt-3
      .col-12
        h4 state
        table.table
          tr
            th Path
            th Value
          tr
            td vm.$store.state.auth.loggedIn
            td {{ $store.state.auth.loggedIn }}
          tr
            td vm.$store.state.auth.user
            td
              pre {{ JSON.stringify($store.state.auth.user, null, 2) }}
    .row.mt-3
      .col-12
        h4 details
        readme

        vue-snotify
</template>

<script>
import Readme from '../components/Readme'
import NoOpQ from './NoOpQ'

export default {
  auth: false,
  components: {
    readme: Readme
  },
  methods: {
    async login () {
      await this.$auth.loginWith('graphql', {
        email: 'test@email.com',
        password: 'password'
      })
    },
    logout () {
      this.$auth.logout()
    },
    async sendQuery () {
      try {
        await this.$apollo.query({
          query: NoOpQ,
          fetchPolicy: 'network-only'
        })
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>
.links {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
