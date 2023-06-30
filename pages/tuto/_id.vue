<template>
  <div>
    <h1>{{ article.title }}</h1>
    <div v-html="article.content"></div>
  </div>
</template>

<script>
export default {
  name: 'TutoSingle',
  data() {
    return {
      article: {},
    }
  },
  async fetch() {
    try {
      const article = await this.$axios.get(
        'articles/findById/' + this.$route.params.id
      )
      this.article = article.data
    } catch (e) {
      console.log(e)
    }
  },
}
</script>

<style lang="scss" scoped></style>
