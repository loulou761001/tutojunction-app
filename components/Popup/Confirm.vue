<template>
  <component :is="'PopupBase'" class="popup-media">
    <div
      class="close"
      @click="
        () => {
          setConfPopupOpen(false)
          if ($route.name === 'creer' || $route.name === 'search') {
            $router.back()
          }
        }
      "
    >
      <font-awesome-icon icon="fa-xmark" size="xl" />
    </div>
    <p>Tu dois confirmer ton compte pour faire ça !</p>
    <p>
      <nuxt-link :to="'/'" @click.native="setConfPopupOpen(false)"
        >Clique ici pour confirmer ton compte</nuxt-link
      >
    </p>
  </component>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'PopupConfirm',
  beforeRouteLeave() {
    this.setConfPopupOpen(false)
  },
  computed: {
    ...mapGetters(['loggedInUser']),
  },
  methods: {
    ...mapActions(['setConfPopupOpen']),
  },
}
</script>

<style lang="scss" scoped>
p {
  text-align: center;
}
</style>
