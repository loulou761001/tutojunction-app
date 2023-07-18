<template>
  <div v-if="$fetchState.pending" class="app-sidebar loading">
    <SpinnerLoader />
  </div>
  <div v-else class="app-sidebar">
    <div class="app-sidebar--pannel">
      <h4 class="app-sidebar--pannel_title">
        Consulter les messages des utilisateurs
      </h4>
      <nuxt-link
        v-if="$auth.loggedIn"
        to="/modmail"
        class="app-sidebar--pannel_item"
        >Messages des utilisateurs</nuxt-link
      >
      <nuxt-link
        v-if="$auth.loggedIn"
        to="/modmail"
        class="app-sidebar--pannel_item"
        >Demandes de certifications</nuxt-link
      >
    </div>
    <div v-if="isMod" class="app-sidebar--pannel">
      <h4 class="app-sidebar--pannel_title">Vers le site utilisateur</h4>
      <nuxt-link to="/" class="app-sidebar--pannel_item"
        >TutoJunction.com</nuxt-link
      >
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AdminAppSidebar',

  data() {
    return {
      users: [],
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
    ...mapGetters(['isAuthenticated', 'loggedInUser', 'isMod']),
  },
  methods: {},
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
