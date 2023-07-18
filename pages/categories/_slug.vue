<template>
  <SpinnerLoader v-if="$fetchState.pending" />
  <div v-else-if="error" class="category-page_error">404</div>
  <div v-else class="category-page">
    <div class="category-page--header">
      <h1>
        {{ category.name }}
        <button
          v-if="!follows"
          :disabled="loading"
          class="small btn"
          @click="followCat"
        >
          Suivre
        </button>
        <button v-else :disabled="loading" class="small btn" @click="followCat">
          Ne plus suivre
        </button>
      </h1>
    </div>
    <div v-if="!category.parent && subs.length">
      <nuxt-link
        v-for="sub in subs"
        :key="sub._id"
        :to="'/categories/' + sub.slug"
        class="category-name small"
        >{{ sub.name }}</nuxt-link
      >
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
  name: 'CategoriesSlug',
  components: { TutoCard, SpinnerLoader },
  data() {
    return {
      error: false,
      category: null,
      articles: [],
      subs: [],
      loading: false,
    }
  },

  async fetch() {
    const category = this.getCategories.find(
      (item) => item.slug === this.$route.params.slug
    )
    this.$utils.consoleLog('category', category)
    if (!category) {
      this.error = true
      this.$error()
      return
    }
    this.category = category
    try {
      const articles = await this.$axios.get(
        'articles/byCategory/' + category._id
      )
      const subs = await this.$axios.get('categories/getSubs/' + category._id)
      this.$utils.consoleLog('articles', articles.data)
      this.articles = articles.data
      this.subs = subs.data
    } catch (e) {
      this.$utils.consoleLog(e)
    }
  },
  computed: {
    ...mapGetters({
      getCategories: 'getCategories',
      loggedInUser: 'loggedInUser',
    }),
    follows() {
      return this.loggedInUser.categories_followed.includes(this.category._id)
    },
  },
  methods: {
    followCat() {
      this.loading = true
      if (!this.follows) {
        this.$axios
          .put('users/followCat', { category: this.category._id })
          .then(async (data) => {
            await this.$auth.fetchUser()
          })
          .catch((err) => {
            this.$utils.consoleError(err)
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        this.$axios
          .put('users/unfollowCat', { category: this.category._id })
          .then(async (data) => {
            await this.$auth.fetchUser()
          })
          .catch((err) => {
            this.$utils.consoleError(err)
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
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
