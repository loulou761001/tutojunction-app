<template>
  <header class="tj-header">
    <nuxt-link to="/home" class="tj-header_logo no-deco"><tj-logo /></nuxt-link>

    <div class="tj-header--inner">
      <div class="input">
        <input type="text" placeholder="Recherche..." />
        <font-awesome-icon icon="magnifying-glass" class="icon" />
      </div>
      <font-awesome-icon
        v-if="!$breakpoints.lLg"
        icon="bars"
        size="2x"
        class="burger"
        @click="navOpen = !navOpen"
      />
      <nav v-if="$breakpoints.lLg || navOpen" class="tj-header--inner--nav">
        <nuxt-link to="/categories" class="tj-header--inner--nav--item"
          >Nos catégories</nuxt-link
        >
        <nuxt-link to="/categories" class="tj-header--inner--nav--item"
          >Rédige un article !</nuxt-link
        >
        <nuxt-link to="/register" class="tj-header--inner--nav--item"
          >Je m'inscris !</nuxt-link
        >
        <nuxt-link to="/register" class="tj-header--inner--nav--item"
          >Je me connecte !</nuxt-link
        >
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: 'HeaderComp',
  data() {
    return {
      navOpen: false,
    }
  },
  watch: {
    $route(to, from) {
      this.navOpen = false
    },
  },
}
</script>

<style lang="scss" scoped>
.tj-header {
  padding: calc(15px + env(safe-area-inset-top)) $pad $pad-min;
  position: relative;
  padding-block: $pad-min;
  @include min-sm {
    padding-block: $pad-demi + $rad;
  }
  &--inner {
    display: flex;
    align-items: center;
    padding-left: $pad-min;
    @include min-sm {
      padding-left: 80px;
    }
    .burger {
      margin-left: $pad-min;
      cursor: pointer;
      @include min-md {
        margin-inline: $pad-demi;
      }
    }

    &--nav {
      font-weight: bold;
      position: absolute;
      top: 64px;
      width: 100vw;
      right: 0;
      display: flex;
      flex-direction: column;
      background-color: white;
      //margin-left: auto;
      gap: $pad-min;
      padding: $pad-min;
      &--item {
        margin: auto;
      }
      @include min-lg {
        max-width: 500px;
        position: static;
        padding-left: $pad-min;
        min-width: 350px;
        justify-content: space-between;
        flex-direction: row;
        .tj-header--inner--nav--item {
          margin: auto;
        }
      }
    }
    .input {
      width: 100%;
      max-width: 500px;
      margin: auto;
      input {
        width: 100%;
        padding-right: $pad-demi;
        background-color: $brand-light-grey;
        border-radius: $rad;
      }
      position: relative;
      .icon {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translate(0, -50%);
      }
    }
  }
}
</style>
