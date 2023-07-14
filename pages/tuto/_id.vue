<template>
  <div v-if="error"><p>error</p></div>
  <div v-else class="single-article">
    <div class="single-article--inner">
      <div class="single-article--inner_top">
        <div>
          <nuxt-link to="/">Tutos</nuxt-link>
        </div>
        <div v-for="cat in article.categories" :key="cat._id">
          <font-awesome-icon icon="chevron-right" /><nuxt-link
            :to="'/categories/' + cat.slug"
            >{{ cat.name }}</nuxt-link
          >
        </div>
      </div>

      <h1
        class="single-article--inner_title mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
      >
        {{ article.title }}
      </h1>
      <div>
        <nuxt-link
          v-for="tag in article.tags"
          :key="tag"
          :to="'/tags/' + tag.toLowerCase()"
          class="category-name small"
        >
          {{ tag }}</nuxt-link
        >
      </div>
      <hr />
      <div v-html="article.content"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TutoSingle',
  data() {
    return {
      article: {},
      error: false,
    }
  },
  async fetch() {
    try {
      const article = await this.$axios.get(
        'articles/findById/' + this.$route.params.id
      )
      console.log(article.data)
      this.article = article.data
    } catch (e) {
      this.error = true
      console.log('error', e)
    }
  },
  watch: {
    success: function () {
      //   INCREMENT VIEW COUNT
      if (this.success) {
        setTimeout(() => {
          this.$axios
            .put('/articles/incrementViews/' + this.$route.params.id)
            .then((data) => {
              this.$utils.consoleLog('Views incremented', data.data)
            })
            .catch((e) => {
              this.$utils.consoleError('Views incrementation error', e)
            })
        }, 10000)
      }
    },
  },
  mounted() {},
}
</script>

<style lang="scss" scoped>
.single-article {
  &--inner {
    padding: $pad-min;
    &_top {
      display: flex;
      gap: $rad;
      > div {
        display: flex;
        gap: 6px;
        > * {
          margin: auto;
        }
      }
    }
    &_title {
      //font-size: 24px;
    }
  }
}
</style>
