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
</template>

<script>
import marked from 'marked'

export default {
  data () {
    return { readme: [] }
  },
  methods: {
    kebab (value) {
      return value.replace(/\s/, '-')
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
  }
}
</script>

<style>
</style>
