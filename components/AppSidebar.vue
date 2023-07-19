<template>
  <div v-if="$fetchState.pending" class="app-sidebar loading">
    <SpinnerLoader />
  </div>
  <div v-else class="app-sidebar">
    <div class="app-sidebar--pannel">
      <h4 class="app-sidebar--pannel_title">Nos catégories</h4>
      <nuxt-link
        v-for="cat in categoriesToShow"
        :key="cat._id"
        :to="'/categories/' + cat.slug"
        class="app-sidebar--pannel_item"
      >
        {{ cat.name }}
      </nuxt-link>
      <nuxt-link v-if="categories.length > 10" to="/categories"
        >Voir plus</nuxt-link
      >
    </div>
    <div v-if="getRecoUsers && getRecoUsers.length" class="app-sidebar--pannel">
      <h4 class="app-sidebar--pannel_title">Rédacteurs recommandés</h4>
      <UserSmallCard
        v-for="user in getRecoUsers"
        :key="user._id"
        :user="user"
      />
    </div>
    <div class="app-sidebar--pannel">
      <h4 class="app-sidebar--pannel_title">Un probleme, des retours ?</h4>
      <nuxt-link
        v-if="$auth.loggedIn"
        to="/modmail"
        class="app-sidebar--pannel_item"
        >Contacte l'équipe !</nuxt-link
      >
    </div>
    <div class="app-sidebar--pannel">
      <h4 class="app-sidebar--pannel_title">
        consulter nos mentions légales ?
      </h4>
      <nuxt-link to="/cgu" class="app-sidebar--pannel_item"
        >Nos mentions légales</nuxt-link
      >
    </div>
    <div class="app-sidebar--pannel">
      <h4 class="app-sidebar--pannel_title">Consulte notre boutique !</h4>
      <a
        target="_blank"
        href="tutojunction.shop"
        class="app-sidebar--pannel_item"
        >TutoJunction.shop</a
      >
    </div>
    <div v-if="isMod" class="app-sidebar--pannel">
      <h4 class="app-sidebar--pannel_title">
        Vers la console d'administration
      </h4>
      <nuxt-link to="/admin" class="app-sidebar--pannel_item"
        >Console d'administration</nuxt-link
      >
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import UserSmallCard from './User/SmallCard.vue'
import SpinnerLoader from './SpinnerLoader.vue'

export default {
  name: 'AppSidebar',
  components: { SpinnerLoader, UserSmallCard },

  data() {
    return {
      users: [],
      categories: [],
    }
  },
  async fetch() {
    try {
      const reco = await this.$axios.get('users/recommended')
      this.$utils.consoleLog('reco', reco.data)
      this.fillRecoUsers(reco.data)
    } catch (e) {
      this.$utils.consoleError(e)
    }
  },
  watch: {
    '$route.path': function () {
      this.$fetch()
    },
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser', 'getRecoUsers', 'isMod']),
    ...mapGetters({ getCategories: 'getCategories' }),
    parentCategories() {
      return this.getCategories.filter((item) => !item.parent)
    },

    categoriesToShow() {
      return this.parentCategories.slice(0, 10)
    },
    usersToShow() {
      return this.users.slice(0, 6)
    },
  },
  methods: {
    ...mapActions(['fillRecoUsers']),
  },
}
</script>

<style lang="scss" scoped>
.app-sidebar {
  &.loading {
    max-width: 300px;
  }
  position: relative;
  border-left: 1px solid $brand-grey;
  height: 100%;
  padding: $pad-min;

  min-width: 350px;
  &--pannel {
    max-width: 300px;
    width: 100%;
    border-radius: $rad;

    padding: $rad;
    margin-bottom: $pad-min;
    display: flex;
    margin-right: auto;
    flex-direction: column;
    &_title {
      font-weight: bold;
      border-bottom: 2px solid black;
      margin-bottom: $pad-min;
    }
    &_item {
      margin-bottom: $rad;
    }
  }
}
</style>
