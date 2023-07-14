<template>
  <SpinnerLoader v-if="$fetchState.pending" />
  <div v-else-if="error" class="category-page_error">404</div>
  <div v-else class="category-page">
    <div class="category-page--header">
      <h1>{{ category.name }}</h1>
    </div>
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
  name: 'CategoriesSlug',
  components: { TutoCard, SpinnerLoader },
  data() {
    return {
      error: false,
      category: null,
      articles: [],
    }
  },
  computed: {
    ...mapGetters({ getCategories: 'getCategories' }),
  },
  async fetch() {
    const category = this.getCategories.find(
      (item) => item.slug === this.$route.params.slug
    )
    console.log('category', category)
    if (!category) {
      this.error = true
      return
    }
    this.category = category
    try {
      const articles = await this.$axios.get(
        'articles/byCategory/' + category._id
      )
      console.log('articles', articles.data)
      this.articles = articles.data
    } catch (e) {
      this.$utils.consoleLog(e)
    }
  },
  mounted() {
    console.log(this.articles)
  },
}
</script>

<style lang="scss" scoped>
.category-page {
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
