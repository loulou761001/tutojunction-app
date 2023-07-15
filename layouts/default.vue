<template>
  <div v-if="$fetch.pending" class="loading">
    <font-awesome-icon
      icon="fa-solid fa-circle-notch"
      class="spinner rotate"
      size="lg"
      style="color: #000000"
    />
  </div>
  <div v-else class="app">
    <HeaderComp />
    <div v-if="$route.query.banned" class="banned error">
      <p>Désolé, tu as été banni.</p>
    </div>
    <div class="app--content flex">
      <nuxt class="app--content_center" />
      <AppSidebar
        v-if="
          !$route.name.includes('login') && !$route.name.includes('register')
        "
        v-show="$breakpoints.lLg"
        class="app--content_side"
      />
      <AppSidebarBasic v-else-if="$breakpoints.lLg" class="app--content_side" />
    </div>
    <popup-confirm v-if="isAuthenticated && getConfPopupOpen" />
    <popup-login v-else-if="getConfPopupOpen" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import HeaderComp from '../components/Header.vue'
import AppSidebar from '../components/AppSidebar.vue'
import PopupLogin from '../components/Popup/Login.vue'
import PopupConfirm from '../components/Popup/Confirm.vue'

export default {
  name: 'Default',
  components: { PopupConfirm, PopupLogin, AppSidebar, HeaderComp },

  async fetch() {
    await this.fillCategories()
  },

  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser', 'getConfPopupOpen']),
  },
  methods: {
    ...mapActions(['fillCategories', 'setConfPopupOpen']),
  },
  async $route(to, from) {
    this.setConfPopupOpen(false)
    if (this.isAuthenticated && this.loggedInUser.banned) {
      await this.$router.push('/logout?banned=1')
    }
  },
}
</script>

<style lang="scss" scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  .banned {
    width: 100%;
    padding: $pad-min;
    background-color: $brand-light-grey;
    border-bottom: $brand-orange;
  }
  &--content {
    height: 100%;
    flex-grow: 1;

    &_center {
      width: 100%;
      max-width: 1020px;
    }
    &_side {
      display: flex;
      height: 100%;
      min-height: 100%;
      flex-grow: 1;
      flex-direction: column;
    }
  }
}
</style>
