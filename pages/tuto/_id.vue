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
      <div
        v-if="!article.published_at && article.author._id === loggedInUser.id"
        class="single-article--inner_warning"
      >
        <p>
          Ce tuto est en cours de vérification par notre équipe de modération,
          tu recevras un email une fois qu'il sera rendu public.
        </p>
      </div>
      <div
        v-if="
          loggedInUser.role === 'moderator' || loggedInUser.role === 'admin'
        "
        class="single-article--inner_moderation"
      >
        <p v-if="!article.published_at">
          Cet article n'a pas encore été publié.
        </p>
        <p v-else>Cet article est publié.</p>
        <button v-if="!article.published_at" class="btn" @click="publish">
          Publier
        </button>
        <button v-else class="btn" @click="unpublish">Dépublier</button>
        <button
          class="btn red"
          @click="
            deleting.popup = true
            deleting.loading = false
          "
        >
          Supprimer
        </button>
      </div>
      <div
        v-if="loggedInUser._id === article.author._id"
        class="single-article--inner_moderation"
      >
        <p v-if="!article.published_at">
          Cet article n'a pas encore été publié.
        </p>
        <p v-else>Cet article est publié.</p>
        <button
          class="btn red"
          @click="
            deleting.popup = true
            deleting.loading = false
          "
        >
          Supprimer
        </button>
      </div>
      <h1 class="single-article--inner_title">
        {{ article.title }}
      </h1>
      <div class="single-article--inner_author">
        <p>{{ article.author.username }}</p>
      </div>
      <img
        :src="article.thumbnail.url"
        class="single-article--inner_thumbnail"
      />
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
      <hr />
      <TutoRow
        v-if="
          similarTutos.loading === false &&
          similarTutos.data.filter((item) => item._id !== article._id).length
        "
        :tutos="similarTutos.data.filter((item) => item._id !== article._id)"
        title="Tutos similaires :"
      />
      <spinner-loader v-else-if="similarTutos.loading === true" />
    </div>
    <popup-loading v-if="loading" />
    <popup-delete
      v-if="deleting.popup"
      :loading="deleting.loading"
      @close="
        deleting.loading = false
        deleting.popup = false
      "
      @delete="deleteArticle"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PopupLoading from '../../components/Popup/Loading.vue'
import PopupDelete from '../../components/Popup/Delete.vue'
import TutoRow from '../../components/Tuto/Row.vue'
import SpinnerLoader from '../../components/SpinnerLoader.vue'

export default {
  name: 'TutoSingle',
  components: { SpinnerLoader, TutoRow, PopupDelete, PopupLoading },
  data() {
    return {
      similarTutos: {
        data: [],
        loading: true,
      },
      article: {},
      error: false,
      loading: false,
      deleting: {
        popup: false,
        loading: false,
      },
    }
  },
  async fetch() {
    const url = this.isAuthenticated
      ? 'articles/findById/' +
        this.$route.params.id +
        '?author=' +
        this.loggedInUser.id
      : 'articles/findById/' + this.$route.params.id
    try {
      const article = await this.$axios.get(url)
      this.article = article.data
    } catch (e) {
      this.error = true
      this.$utils.consoleError('error', e)
    }
  },
  computed: {
    ...mapGetters(['loggedInUser', 'isAuthenticated']),
  },
  watch: {
    success: function () {
      //   INCREMENT VIEW COUNT
      if (this.success) {
        setTimeout(function () {
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
  mounted() {
    this.$axios
      .post('articles/findSimilar', { article: this.article })
      .then((data) => {
        this.$utils.consoleLog('similar', data)
        this.similarTutos.data = data.data
      })
      .finally(() => {
        this.similarTutos.loading = false
      })
  },
  methods: {
    deleteArticle() {
      this.deleting.loading = true
      this.$axios
        .delete('articles/' + this.article._id + '/' + this.article.author._id)
        .then(() => {
          this.$router.back()
        })
        .catch((err) => {
          this.$utils.consoleError(err)
        })
        .finally(() => {
          this.deleting.loading = false
        })
    },
    unpublish() {
      this.loading = true
      this.$axios
        .put('/articles/unpublish/' + this.article._id)
        .then(() => {
          this.loading = false
          this.article.published_at = null
        })
        .catch((err) => {
          this.$utils.consoleError(err)
          this.loading = false
        })
    },
    publish() {
      this.loading = true
      this.$axios
        .put('/articles/validate/' + this.article._id, {
          user: this.article.author,
        })
        .then(() => {
          this.loading = false
          this.article.published_at = new Date()
        })
        .catch((err) => {
          this.$utils.consoleError(err)
          this.loading = false
        })
    },
  },
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
    &_warning {
      margin-block: $pad-min;
      background-color: $brand-yellow;
      border-radius: $rad;
      width: 100%;
      padding: $pad-min;
      text-align: center;
    }
    &_moderation {
      margin-block: $pad-min;
      p {
        text-align: center;
        width: 100%;
        padding-bottom: $pad-demi;
      }
      padding: $pad-min;
      background-color: $brand-light-grey;
      border-radius: $rad;
      width: 100%;
      justify-content: space-around;
      display: flex;
      flex-wrap: wrap;
    }
    &_thumbnail {
      width: 100%;
    }
    &_title {
      //font-size: 24px;
    }
  }
}
</style>
