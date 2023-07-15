<template>
  <header class="tj-header">
    <nuxt-link to="/" class="tj-header_logo no-deco"><tj-logo /></nuxt-link>

    <div class="tj-header--inner">
      <div class="input">
        <input type="text" placeholder="Recherche..." />
        <font-awesome-icon icon="magnifying-glass" class="icon" />
      </div>
      <font-awesome-icon
        v-if="!$breakpoints.lLg"
        :icon="navOpen ? 'fa-solid fa-xmark' : 'bars'"
        size="2x"
        style="color: black"
        class="burger"
        @click="navOpen = !navOpen"
      />
      <nav v-if="$breakpoints.lLg || navOpen" class="tj-header--inner--nav">
        <nuxt-link
          v-if="$auth.loggedIn"
          to="/user"
          class="tj-header--inner--nav--item"
        ></nuxt-link>
        <nuxt-link to="/categories" class="tj-header--inner--nav--item"
          >Nos catégories</nuxt-link
        >
        <nuxt-link
          v-if="$auth.loggedIn"
          to="/creer"
          class="tj-header--inner--nav--item"
          >Rédige un article !</nuxt-link
        >
        <nuxt-link
          v-if="!$auth.loggedIn"
          to="/register"
          class="tj-header--inner--nav--item"
          >Je m'inscris !</nuxt-link
        >
        <nuxt-link
          v-if="!$auth.loggedIn"
          to="/register"
          class="tj-header--inner--nav--item"
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
  z-index: 2;
  background-color: white;
  padding: calc(15px + env(safe-area-inset-top)) $pad $pad-min;
  position: relative;
  padding-block: $pad-min;
  @include box-shadow;
  @include min-sm {
    padding-block: $pad-demi + $rad;
  }
  &_logo {
    z-index: 2;
    position: absolute;
    top: $pad-min;
    left: $pad-min;
    @include min-sm {
      top: 10px;
    }
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
      padding-inline: $pad-min;
      &--item {
        margin: auto;
      }

      @include max-lg {
        border-bottom: 1px $brand-grey solid;
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
