<template>
  <div class="home">
    <flicking
      v-if="articles.featured.length"
      class="home_featured"
      :plugins="[
        new AutoPlay({ duration: 4500, direction: 'NEXT', stopOnHover: false }),
      ]"
      :options="{
        align: 'prev',
        circular: true,
        // panelsPerView: 1,
        moveType: 'snap',
      }"
    >
      <TutoFeaturedCard
        v-for="tuto in articles.featured"
        :key="tuto._id + ' -featured'"
        :tuto="tuto"
      />
    </flicking>
    <div class="home--rows">
      <tuto-row
        v-if="isAuthenticated && articles.subbed.length"
        title="Abonnements"
        :tutos="articles.subbed"
      />
      <tuto-row
        v-if="isAuthenticated && articles.followedCats.length"
        title="Catégories suivies"
        :tutos="articles.followedCats"
      />
      <div v-if="!$breakpoints.lLg && isAuthenticated">
        <h3>Utilisateurs recommandés</h3>
        <hr />
      </div>
      <Flicking
        v-if="!$breakpoints.lLg"
        :options="{ align: 'prev' }"
        style="margin-bottom: 30px"
      >
        <user-small-card
          v-for="user in getRecoUsers"
          :key="user._id"
          :user="user"
          style="margin-right: 5px"
        />
      </Flicking>
      <tuto-row title="Derniers articles" :tutos="articles.latest" />
      <tuto-row title="Les plus aimés" :tutos="articles.likes" />
      <tuto-row title="Les plus vus" :tutos="articles.views" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { AutoPlay } from '@egjs/flicking-plugins'
import TutoRow from '../components/Tuto/Row.vue'
import TutoFeaturedCard from '../components/Tuto/FeaturedCard.vue'
import UserSmallCard from '../components/User/SmallCard.vue'

export default {
  name: 'IndexPage',
  components: { UserSmallCard, TutoFeaturedCard, TutoRow },
  auth: false,
  data() {
    return {
      usersReco: null,
      articles: {
        views: [],
        latest: [],
        likes: [],
        featured: [],
        subbed: [],
        followedCats: [],
      },
    }
  },
  async fetch() {
    try {
      const latest = await this.$axios.get('articles/latest?limit=10')
      this.$utils.consoleLog('latest', latest.data)
      this.articles.latest = latest.data
    } catch (e) {
      this.$utils.consoleError(e)
    }
    try {
      const featured = await this.$axios.get('articles/featured/?limit=6')
      this.$utils.consoleLog('featured', featured.data)
      this.articles.featured = featured.data
    } catch (e) {
      this.$utils.consoleError(e)
    }
    try {
      const views = await this.$axios.get('articles/byViews?limit=10')
      this.$utils.consoleLog('views', views.data)
      this.articles.views = views.data
    } catch (e) {
      this.$utils.consoleError(e)
    }
    try {
      const likes = await this.$axios.get('articles/byLikes?limit=10')
      this.$utils.consoleLog('likes', likes.data)
      this.articles.likes = likes.data
    } catch (e) {
      this.$utils.consoleError(e)
    }
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
    AutoPlay() {
      return AutoPlay
    },
    ...mapGetters(['isAuthenticated', 'loggedInUser', 'getRecoUsers']),
  },

  mounted() {
    this.$utils.consoleLog(this.$store.getters.loggedInUser)
    this.$utils.consoleLog(process.env.NODE_ENV)
  },

  methods: {
    ...mapActions(['fillRecoUsers']),
    checkLoggedIn() {
      this.$utils.consoleLog('test')
      this.$axios
        .get('/users/checkLoggedIn')
        .then((data) => {
          this.$utils.consoleLog(data)
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
  &_featured {
    background-color: $brand-yellow;
    height: 300px;
    @include min-lg {
      height: 420px;
    }
  }
  &--rows {
    padding: $pad-min;
  }
}
</style>
