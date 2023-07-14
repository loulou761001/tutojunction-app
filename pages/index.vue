<template>
  <div class="home">
    <p>frfe</p>
    <button @click="checkLoggedIn">Check logged in</button>
    <div class="home--rows">
      <tuto-row
        v-if="articles.subbed"
        title="Abonnements"
        :tutos="articles.subbed"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TutoRow from '../components/Tuto/Row.vue'

export default {
  name: 'IndexPage',
  components: { TutoRow },
  auth: false,
  data() {
    return {
      articles: {
        subbed: null,
      },
    }
  },
  async fetch() {
    console.log(this.$auth.strategy.token.get())
    if (this.isAuthenticated) {
      try {
        const subbedArticles = await this.$axios.get(
          'articles/subscribed?limit=10'
        )
        this.articles.subbed = subbedArticles.data
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
  &--rows {
    padding: $pad-min;
  }
}
</style>
