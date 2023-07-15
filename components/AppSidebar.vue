<template>
  <!--  <div v-if="$fetchState.pending" class="app-sidebar loading">-->
  <!--    <font-awesome-icon-->
  <!--      icon="fa-solid fa-circle-notch"-->
  <!--      class="spinner rotate"-->
  <!--      size="lg"-->
  <!--      style="color: #000000"-->
  <!--    />-->
  <!--  </div>-->
  <div class="app-sidebar">
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
    <div class="app-sidebar--pannel">
      <h4 class="app-sidebar--pannel_title">Rédacteurs recommandés</h4>
      <UserSmallCard v-for="user in usersReco" :key="user._id" :user="user" />
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserSmallCard from './User/SmallCard.vue'

export default {
  name: 'AppSidebar',
  components: { UserSmallCard },
  data() {
    return {
      users: [],
      usersReco: [],
      categories: [],
    }
  },
  async fetch() {
    await this.$axios.get('/users/recommended').then((data) => {
      console.log('data reco', data.data)
      this.usersReco = data.data
    })
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser']),
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
  mounted() {},
}
</script>

<style lang="scss" scoped>
.app-sidebar {
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
