<template>
  <div v-if="$fetchState.pending" class="loading">
    <SpinnerLoader />
  </div>
  <div v-else class="app">
    <AdminHeaderComp />
    <div
      v-if="isAuthenticated && !loggedInUser.confirmed"
      class="confirm link-style"
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
    <div class="app--content flex">
      <nuxt class="app--content_center" />
      <AdminAppSidebar
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
import AdminHeaderComp from '../components/Admin/Header.vue'

export default {
  name: 'Default',
  components: { AdminHeaderComp },
  data() {
    return {
      emailConfirm: {
        loading: false,
        success: false,
      },
    }
  },
  async fetch() {
    await this.fillCategories()
  },

  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser', 'getConfPopupOpen']),
  },
  methods: {
    ...mapActions(['fillCategories', 'setConfPopupOpen']),
    sendConfMail() {
      this.$utils.consoleLog('sent')
      if (
        this.emailConfirm.success === true ||
        this.emailConfirm.loading === true
      ) {
        return
      }
      this.$utils.consoleLog('send')
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
    border-bottom: $brand-orange 2px solid;
  }
  .confirm {
    width: 100%;
    padding: $pad-min;
    background-color: $brand-light-grey;
    border-bottom: $brand-grey 1px solid;
    cursor: pointer;
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
