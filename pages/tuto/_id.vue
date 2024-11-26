<template>
  <div v-if="error"><p>error</p></div>
  <div v-else class="single-article">
    <div v-if="$fetchState.pending">
      <SpinnerLoader />
    </div>
    <div v-else class="single-article--inner">
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
        <p v-if="isAuthenticated && loggedInUser.role === 'user'">
          Marre d'attendre ?
          <nuxt-link to="/modMail?certif=1">
            Clique ici pour nous envoyer un message et demander à devenir un
            rédacteur certifié !</nuxt-link
          >
        </p>
      </div>
      <div
        v-if="isAuthenticated && isMod"
        class="single-article--inner_moderation"
      >
        <p v-if="!article.published_at">
          Cet article n'a pas encore été publié.
        </p>
        <p v-else>Cet article est publié.</p>
        <button
          v-if="article.published_at"
          class="btn"
          :disabled="featureLoading"
          @click="featureTuto()"
        >
          {{ isFeatured ? 'Ne plus mettre en avant' : 'Mettre en avant' }}
        </button>
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
        v-if="
          isAuthenticated && loggedInUser.id === article.author._id && !isMod
        "
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
        <p>Posté par :</p>
        <user-small-card :user="article.author" />
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
      <div class="single-article--inner_like">
        <p>
          Si tu as aimé cet article, n'hésite pas à lui donner un coup de pouce
          en le likant !
        </p>
        <div class="single-article--inner_like_inner">
          <div @click="like">
            <font-awesome-icon
              v-if="alreadyLiked"
              style="color: #ffcd29"
              icon="fa-solid fa-heart"
              size="xl"
            />
            <font-awesome-icon
              v-else
              style="color: #cfcfcf"
              icon="fa-solid fa-heart"
              size="xl"
            />
          </div>
          <span>{{ article.liked_by.length }}</span>
        </div>
      </div>
      <CommentList />
      <TutoRow
        v-if="
          similarTutos.loading === false &&
          similarTutos.data.filter((item) => item._id !== article._id).length
        "
        :small="true"
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
    <popup-login v-if="loginPopup" @close="loginPopup = false" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import PopupLoading from '../../components/Popup/Loading.vue'
import PopupDelete from '../../components/Popup/Delete.vue'
import TutoRow from '../../components/Tuto/Row.vue'
import SpinnerLoader from '../../components/SpinnerLoader.vue'
import CommentList from '../../components/Comments/List.vue'
import PopupLogin from '../../components/Popup/Login.vue'
import UserSmallCard from '../../components/User/SmallCard.vue'

export default {
  name: 'TutoSingle',
  components: {
    UserSmallCard,
    PopupLogin,
    CommentList,
    SpinnerLoader,
    TutoRow,
    PopupDelete,
    PopupLoading,
  },
  data() {
    return {
      similarTutos: {
        data: [],
        loading: true,
      },
      loginPopup: false,
      article: {},
      error: false,
      loading: false,
      featureLoading: false,
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
        this.loggedInUser.id +
        '&role=' +
        this.loggedInUser.role
      : 'articles/findById/' + this.$route.params.id
    try {
      const article = await this.$axios.get(url)
      this.article = article.data
      await this.findSimilar()
    } catch (e) {
      this.error = true
      this.$error()
      this.$utils.consoleError('error', e)
    }
  },
  head() {
    return {
      title: this.article.title + ' - TutoJunction',
    }
  },
  auth: false,
  computed: {
    ...mapGetters(['loggedInUser', 'isAuthenticated', 'isMod']),
    alreadyLiked() {
      return this.article.liked_by.includes(this.loggedInUser.id)
    },
    isFeatured() {
      return this.article.featured === true
    },
  },
  mounted() {
    const id = this.$route.params.id
    //   INCREMENT VIEW COUNT
    setTimeout(() => {
      if (this.$route.params.id === id) {
        this.$axios
          .get('/articles/incrementViews/' + this.$route.params.id, {})
          .then((data) => {
            this.$utils.consoleLog('Views incremented', data.data)
          })
          .catch((e) => {
            this.$utils.consoleError('Views incrementation error', e)
          })
      }
    }, 10000)
  },
  methods: {
    ...mapActions(['setConfPopupOpen']),
    async findSimilar() {
      await this.$axios
        .post('articles/findSimilar', { article: this.article })
        .then((data) => {
          this.$utils.consoleLog('similar', data)
          this.similarTutos.data = data.data
        })
        .finally(() => {
          this.similarTutos.loading = false
        })
    },
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
    like() {
      if (!this.isAuthenticated) {
        this.loginPopup = true
        return
      }
      if (!this.loggedInUser.confirmed) {
        this.setConfPopupOpen(true)
        return
      }
      if (!this.alreadyLiked) {
        this.article.liked_by.push(this.loggedInUser.id)
        this.$axios
          .put('articles/like/' + this.$route.params.id, {
            user: this.loggedInUser.id,
          })
          .then((data) => {
            this.$utils.consoleLog(data)
          })
          .catch((e) => {
            this.consoleError(e)
          })
      } else {
        this.article.liked_by = this.article.liked_by.filter(
          (item) => item !== this.loggedInUser.id
        )
        this.$axios
          .put('articles/unlike/' + this.$route.params.id, {
            user: this.loggedInUser.id,
          })
          .then((data) => {
            this.$utils.consoleLog(data)
          })
          .catch((e) => {
            this.consoleError(e)
          })
      }
    },
    featureTuto() {
      this.featureLoading = true
      if (!this.isFeatured) {
        this.$axios
          .put('articles/feature/' + this.$route.params.id, {
            user: this.loggedInUser.id,
          })
          .then((data) => {
            this.$utils.consoleLog(data)
            this.article.featured = true
          })
          .catch((e) => {
            this.consoleError(e)
          })
          .finally(() => {
            this.featureLoading = false
          })
      } else {
        this.$axios
          .put('articles/unfeature/' + this.$route.params.id, {
            user: this.loggedInUser.id,
          })
          .then((data) => {
            this.$utils.consoleLog(data)
            this.article.featured = false
          })
          .catch((e) => {
            this.consoleError(e)
          })
          .finally(() => {
            this.featureLoading = false
          })
      }
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
    &_like {
      &_inner {
        display: flex;
        align-items: center;
        gap: $rad;
        font-weight: bold;
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
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      button {
        min-width: 200px;
        width: 50%;
        margin: auto;
        margin-bottom: $pad-min;
        &:not(.red) {
          border: 2px solid $brand-grey;
        }
      }
    }
    &_thumbnail {
      margin-bottom: $pad-min;
      border-radius: $rad;
      background-color: $brand-yellow;
      max-height: 500px;
    }
    &_title {
      //font-size: 24px;
    }
  }
}
</style>
