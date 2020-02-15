<template lang="pug">
  .container
    .row.mt-3
      .col-12
        h1 nuxt graphql jwt auth demo
    .row.mt-3
      .col-4
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
              @click="queryAdminNotRequired"
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
        h4 details
        readme

        vue-snotify
</template>

<script>
import Readme from '../components/Readme'
import NoOpAdminQ from './NoOpAdminQ'
import NoOpNonAdminQ from './NoOpNonAdminQ'

export default {
  auth: false,
  components: {
    readme: Readme
  },
  methods: {
    async loginUser () {
      await this.$auth.loginWith('graphql', {
        username: 'ordinaryUser',
        password: 'password'
      })
    },
    async loginAdmin () {
      await this.$auth.loginWith('graphql', {
        username: 'adminUser',
        password: 'password'
      })
    },
    logout () {
      this.$auth.logout('user requested')
    },
    async queryAdminNotRequired () {
      const { errors } = await this.$apollo.query({
        query: NoOpNonAdminQ,
        fetchPolicy: 'network-only'
      })
      if (errors) return
      this.$snotify.success('Successful query (admin not required)')
    },
    async queryAdminRequired () {
      const { errors } = await this.$apollo.query({
        query: NoOpAdminQ,
        fetchPolicy: 'network-only'
      })
      if (errors) return
      this.$snotify.success('Successful query (admin required)')
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
pre {
  border: none;
  background-color: transparent;
  padding: 0;
  margin: 0;
}
</style>
