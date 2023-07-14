<template>
  <SpinnerLoader v-if="$fetchState.pending" />
  <div v-else-if="error" class="category-page_error">404</div>
  <div v-else class="category-page">
    <div class="category-page--header">
      <h1>{{ tag }}</h1>
    </div>
    <hr />
    <div class="category-page--content">
      <TutoCard
        v-for="article in articles"
        :key="article._id"
        :tuto="article"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SpinnerLoader from '../../components/SpinnerLoader.vue'
import TutoCard from '../../components/Tuto/Card.vue'

export default {
  name: 'TagSingle',
  components: { TutoCard, SpinnerLoader },
  data() {
    return {
      error: false,
      tag: null,
      articles: [],
    }
  },

  async fetch() {
    this.tag = this.$route.params.tag
    try {
      const articles = await this.$axios.get('articles/byTag/' + this.tag)
      this.$utils.consoleLog('articles', articles.data)
      this.articles = articles.data
    } catch (e) {
      this.$utils.consoleLog(e)
    }
  },
  computed: {
    ...mapGetters({ getCategories: 'getCategories' }),
  },
}
</script>

<style lang="scss" scoped>
.category-page {
  padding: $pad-min;
  &--header {
  }
  &--content {
    padding: $pad-min;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    row-gap: $pad-min;
    gap: $pad-min;
  }
}
</style>
