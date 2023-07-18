<template>
  <header class="tj-header">
    <nuxt-link to="/admin" class="tj-header_logo no-deco"
      ><tj-logo />
      <h4 style="display: flex">Admin</h4></nuxt-link
    >

    <div class="tj-header--inner">
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
          ><UserAvatar :avatar="loggedInUser.avatar" size="48px"
        /></nuxt-link>
        <nuxt-link to="/admin/categories" class="tj-header--inner--nav--item"
          >Les catégories</nuxt-link
        >
        <nuxt-link
          v-if="$auth.loggedIn"
          to="/admin/modmails"
          class="tj-header--inner--nav--item"
          >Messages d'utilisateurs</nuxt-link
        >
        <nuxt-link
          v-if="$auth.loggedIn && $breakpoints.sMd"
          to="/admin/modmail"
          class="tj-header--inner--nav--item"
          >Un probleme, des retours ? Contacte l'équipe !</nuxt-link
        >
        <nuxt-link
          v-if="$breakpoints.sMd"
          to="/admin"
          class="tj-header--inner--nav--item"
          >Retour sur le site</nuxt-link
        >
        <nuxt-link
          v-if="!$auth.loggedIn"
          to="/register"
          class="tj-header--inner--nav--item"
          >Je m'inscris !</nuxt-link
        >
        <nuxt-link
          v-if="!$auth.loggedIn"
          to="/login"
          class="tj-header--inner--nav--item"
          >Je me connecte !</nuxt-link
        >
      </nav>
    </div>
  </header>
</template>

<script>
import debounce from 'lodash.debounce'
import { mapActions, mapGetters } from 'vuex'
import UserAvatar from '../User/Avatar.vue'
export default {
  name: 'AdminHeaderComp',
  components: { UserAvatar },
  data() {
    return {
      navOpen: false,
      search: {
        query: '',
        results: [],
      },
    }
  },
  computed: {
    ...mapGetters(['loggedInUser', 'isAuthenticated', 'isMod']),
  },
  methods: {
    ...mapActions(['setConfPopupOpen']),
    goSearchPage() {
      if (this.loggedInUser.confirmed === false) {
        this.setConfPopupOpen(true)
        return
      }
      if (this.search.query.length === 0) {
        return
      }
      this.$router.push('/search?query=' + this.search.query)
    },
    searchDebounce: debounce(function () {
      this.searchAutocomplete()
    }, 300),
    searchAutocomplete() {
      if (this.search.query.trim().length === 0) return
      this.$axios
        .post('articles/autocomplete', { query: this.search.query.trim() })
        .then((data) => {
          console.log(data)
          this.search.results = data.data
        })
    },
  },
  watch: {
    $route(to, from) {
      this.search.query = ''
      this.navOpen = false
    },
  },
}
</script>

<style lang="scss" scoped>
.tj-header {
  z-index: 2;
  background-color: white;
  padding: calc(15px + env(safe-area-inset-top)) $pad-demi $pad-min;
  position: relative;
  padding-block: $pad-min;
  @include box-shadow;
  @include min-sm {
    padding-block: $pad-demi + $rad;
  }
  &_logo {
    display: flex;
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
    //justify-content: space-between;
    @include min-sm {
      padding-left: 80px;
    }

    .burger {
      margin-left: $pad-min;
      cursor: pointer;
      margin-left: auto;
      @include min-md {
        margin-inline: auto $pad-demi;
      }
    }

    &--nav {
      margin-left: auto;
      font-weight: bold;
      position: absolute;
      top: 64px;
      width: 100%;
      right: 0;
      display: flex;
      flex-direction: column;
      background-color: white;
      //margin-left: auto;
      gap: $pad-min;
      padding-inline: $pad-min;
      padding-block: $pad-demi $pad-min;
      &--item {
        margin: auto;
        text-align: center;
      }

      @include max-lg {
        border-bottom: 1px $brand-grey solid;
      }
      @include min-lg {
        padding-top: 0;
        max-width: 500px;
        position: static;
        padding-left: $pad-min;
        min-width: 350px;
        justify-content: space-between;
        flex-direction: row;
        .tj-header--inner--nav--item {
          margin: auto;
          text-align: left;
        }
      }
    }

    .search-results {
      border: 1px solid $brand-grey;
      z-index: 3;
      top: 100%;
      position: absolute;
      width: 100%;
      max-width: 500px;
      padding: $rad;
      background-color: white;
      border-radius: $rad;
      display: flex;
      flex-direction: column;
      gap: $rad;
      &--item {
        cursor: pointer;
        padding: $rad;
        border-radius: $rad;

        &:hover {
          background-color: $brand-light-grey;
        }
      }
    }
    .search-input {
      width: 100%;
      max-width: 500px;
      margin: auto;
      position: relative;
      form {
        position: relative;
      }
      input {
        width: 100%;
        padding-right: $pad-demi;
        background-color: $brand-light-grey;
        border-radius: $rad;
      }

      .icon {
        cursor: pointer;
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translate(0, -50%);
      }
    }
  }
}
</style>
