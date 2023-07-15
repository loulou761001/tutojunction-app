<template>
  <div class="home">
    <div
      v-if="isAuthenticated && !loggedInUser.confirmed"
      class="home--confirm link-style"
      @click.prevent="sendConfMail"
    >
      <SpinnerLoader v-if="emailConfirm.loading" />
      <p v-else-if="!emailConfirm.loading && !emailConfirm.success">
        Tu n'as pas encore confirmé ton compte, clique ici pour te faire
        renvoyer l'email de confirmation.
      </p>
      <p v-else-if="!emailConfirm.loading && emailConfirm.success">
        Un email t'a été envoyé à {{ loggedInUser.email }}
      </p>
    </div>
    <div class="home--rows">
      <tuto-row
        v-if="isAuthenticated && articles.subbed.length"
        title="Abonnements"
        :tutos="articles.subbed"
      />
      <hr class="grey" />
      <tuto-row
        v-if="isAuthenticated && articles.followedCats.length"
        title="Catégories suivies"
        :tutos="articles.followedCats"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TutoRow from '../components/Tuto/Row.vue'
import SpinnerLoader from '../components/SpinnerLoader.vue'

export default {
  name: 'IndexPage',
  components: { SpinnerLoader, TutoRow },
  auth: false,
  data() {
    return {
      emailConfirm: {
        loading: false,
        success: false,
      },
      articles: {
        subbed: [],
        followedCats: [],
      },
    }
  },
  async fetch() {
    if (this.isAuthenticated) {
      try {
        const subbedArticles = await this.$axios.get(
          'articles/subscribed?limit=10'
        )
        this.articles.subbed = subbedArticles.data
      } catch (e) {
        this.$utils.consoleError(e)
      }
      try {
        const followedCats = await this.$axios.post(
          'articles/subbedCategories/?limit=10',
          { categories: this.loggedInUser.categories_followed }
        )
        this.articles.followedCats = followedCats.data
      } catch (e) {
        this.$utils.consoleError(e)
      }
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser']),
  },

  mounted() {
    console.log(this.$store.getters.loggedInUser)
    this.$utils.consoleLog(process.env.NODE_ENV)
  },

  methods: {
    sendConfMail() {
      console.log('se d')
      if (
        this.emailConfirm.success === true ||
        this.emailConfirm.loading === true
      ) {
        return
      }
      console.log('send')
      this.emailConfirm.loading = true
      this.$axios
        .get('users/resendMail')
        .then((data) => {
          this.emailConfirm.success = true
        })
        .catch((e) => {
          this.$utils.consoleError(e)
        })
        .finally(() => {
          this.emailConfirm.loading = false
        })
    },
    checkLoggedIn() {
      console.log('test')
      this.$axios
        .get('/users/checkLoggedIn')
        .then((data) => {
          console.log(data)
        })
        .catch((e) => {
          console.error(e)
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.home {
  &--confirm {
    width: 100%;
    padding: $pad-min;
    background-color: $brand-light-grey;
    border-bottom: $brand-orange;
    cursor: pointer;
  }
  &--rows {
    padding: $pad-min;
  }
}
</style>
