<template>
  <div class="category-index">
    <h4>Nos catégories :</h4>
    <div
      v-for="cat in shownCategories"
      :key="cat._id"
      class="category-index--inner"
    >
      <nuxt-link
        :to="'/categories/' + cat.slug"
        class="category-index--inner_link category-name"
        >{{ cat.name }}</nuxt-link
      >
      <TutoRow
        v-if="getArticlesForCat(cat).length"
        :tutos="getArticlesForCat(cat)"
        :small="true"
        class="category-index--inner_card"
      />
      <hr class="grey" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TutoRow from '../../components/Tuto/Row.vue'

export default {
  name: 'Categories',
  auth: false,
  components: { TutoRow },
  data() {
    return {
      articles: [],
    }
  },
  async fetch() {
    const endpoits = []
    this.shownCategories.forEach((cat) => {
      endpoits.push('/articles/byCategory/' + cat._id + '?limit=4')
    })
    await Promise.all(
      endpoits.map((endpoint) => this.$axios.get(endpoint))
    ).then((data) => {
      const articles = data.map((item) => item.data)
      console.log('data', articles)
      articles.forEach((item) => {
        item.forEach((article) => {
          this.articles.push(article)
        })
      })
      // this.articles = articles
    })
  },
  computed: {
    ...mapGetters({
      categories: 'getCategories',
    }),
    shownCategories() {
      return this.categories.filter((item) => !item.parent)
    },
  },

  mounted() {
    // console.log('articles,', this.articles)
  },
  methods: {
    getArticlesForCat(cat) {
      const articles = this.articles.filter(
        (item) => item.categories[0]._id === cat._id
      )
      console.log(cat.name, articles)
      return articles
    },
  },
}
</script>

<style lang="scss" scoped>
.category-index {
  display: flex;
  flex-direction: column;
  padding: $pad-min;
  &--inner {
    &_link {
    }
    &_card {
      padding-top: $pad-min;
    }
    hr {
      margin-block: $pad-min;
    }
  }
}
</style>
