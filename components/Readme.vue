<template lang="pug">
  .container
    .d-none(
      ref="rawReadme"
    )
      include ../README.md
    b-card(
      no-body
    )
      b-tabs(
        pills
        card
        vertical
      )
        b-tab(
          v-for="section in readme"
          :key="kebab(section.heading)"
          :title="section.heading"
          v-html="section.content"
        )
        b-tab(
          key="state"
          title="State"
        )
          table.table
            tr
              th.col-3 Path
              th.col-9 Value
            tr
              td vm.$store.state.auth.loggedIn
              td {{ $store.state.auth.loggedIn }}
            tr
              td vm.$store.state.auth.accessTokenExpiresAt
              td {{ accessTokenExpiresAt }}
            tr
              td vm.$store.state.auth.refreshTokenExpiresAt
              td {{ refreshTokenExpiresAt }}
            tr
              td vm.$store.state.auth.user
              td
                pre {{ JSON.stringify($store.state.auth.user, null, 2) }}
</template>

<script>
import marked from 'marked'
import moment from 'moment'

export default {
  data () {
    return { readme: [] }
  },
  computed: {
    accessTokenExpiresAt () {
      const expiry = this.$store.state.auth.accessTokenExpiresAt
      if (!expiry) return 'null'
      return moment(expiry).format('HH:mm:ss')
    },
    refreshTokenExpiresAt () {
      const expiry = this.$store.state.auth.refreshTokenExpiresAt
      if (!expiry) return 'null'
      return moment(expiry).format('HH:mm:ss')
    }
  },
  mounted () {
    const tokens = this.$refs.rawReadme.innerHTML.split(/^##\s(.+)$/m)
    if (tokens.length % 2) { tokens.shift() }
    while (tokens.length) {
      this.readme.push({
        heading: tokens.shift(),
        content: marked(tokens.shift())
      })
    }
  },
  methods: {
    kebab (value) {
      return value.replace(/\s/, '-')
    }
  }
}
</script>

<style>
</style>
