<template lang="pug">
  .container
    .row.mt-3
      .col-12
        h1 nuxt graphql jwt auth demo
    .row.mt-3
      .col-12
        h4 try it out
        .links
          b-dropdown.mr-3(
            :disabled="$store.state.auth.loggedIn"
            variant="primary"
            split
            @click="loginUser"
            text="Login"
          )
            b-dropdown-item(
              @click="loginUser"
            ) ... as user
            b-dropdown-item(
              @click="loginAdmin"
            ) ... as admin
          b-dropdown.mr-3(
            :disabled="!$store.state.auth.loggedIn"
            variant="primary"
            split
            @click="queryAdminNotRequired"
            text="Send Query"
          )
            b-dropdown-item(
              @click="queryAdminRequired"
            ) ... normal query
            b-dropdown-item(
              @click="queryAdminRequired"
            ) ... privileged query
          b-button(
            variant="primary"
            :disabled="!$store.state.auth.loggedIn"
            @click="logout"
          ) Logout
    .row.mt-3
      .col-12
        h4 state
        table.table
          tr
            th.col-3 Path
            th.col-9 Value
          tr
            td vm.$store.state.auth.loggedIn
            td {{ $store.state.auth.loggedIn }}
          tr
            td vm.$store.state.auth.accessTokenExpiresAt
            td.
              {{
                $moment($store.state.auth.accessTokenExpiresAt)
                  .format('HH:MM:SS')
              }}
          tr
            td vm.$store.state.auth.refreshTokenExpiresAt
            td.
              {{
                $moment($store.state.auth.refreshTokenExpiresAt)
                  .format('HH:MM:SS')
              }}
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
    async loginUser () {
      await this.$auth.loginWith('graphql', {
        email: 'test@email.com',
        password: 'password'
      })
    },
    async loginAdmin () {
      await this.$auth.loginWith('graphql', {
        email: 'test@email.com',
        password: 'password'
      })
    },
    logout () {
      this.$auth.logout()
    },
    async queryAdminNotRequired () {
      try {
        await this.$apollo.query({
          query: NoOpQ,
          fetchPolicy: 'network-only'
        })
      } catch (error) {
        console.log(error)
      }
    },
    async queryAdminRequired () {
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
.btn-primary:disabled,
.btn-primary.disabled {
  border-color: #b0b0b0;
  background-color: #b0b0b0;
}
.links {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
