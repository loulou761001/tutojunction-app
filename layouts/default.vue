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
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import HeaderComp from '../components/Header.vue'
import AppSidebar from '../components/AppSidebar.vue'

export default {
  name: 'Default',
  components: { AppSidebar, HeaderComp },

  async fetch() {
    await this.fillCategories()
  },
  methods: {
    ...mapActions(['fillCategories']),
  },
}
</script>

<style lang="scss" scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
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
