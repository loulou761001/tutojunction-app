<template>
  <nuxt-link :to="url" class="user-small-card">
    <user-avatar :avatar="userData.avatar" size="48px" />
    <div class="user-small-card--info">
      <span
        :title="userData.username.length >= 14 ? userData.username : null"
        class="user-small-card--info_username"
        >{{
          userData.username.length >= 14
            ? userData.username.slice(0, 12) + '...'
            : userData.username
        }}
        <font-awesome-icon
          v-if="user.role === 'writer'"
          icon="fa-solid fa-pen-nib"
          style="color: #ffcd29"
          title="Rédacteur certifié"
        />
        <font-awesome-icon
          v-else-if="user.role === 'admin' || user.role === 'moderator'"
          icon="fa-solid fa-star"
          style="color: #ffcd29"
          title="Modérateur"
        />
      </span>
    </div>
    <button
      v-if="isAuthenticated && userData.slug !== loggedInUser.slug"
      :disabled="loading"
      class="btn user-small-card--follow dark"
      @click.prevent="loading ? null : follow()"
    >
      {{ isFollowed ? 'Suivi' : 'Suivre' }}
    </button>
    <button
      v-else-if="isAuthenticated && userData.slug === loggedInUser.slug"
      class="btn user-small-card--follow dark"
    >
      Ton profil
    </button>
  </nuxt-link>
</template>

<script>
import { mapGetters } from 'vuex'
import UserAvatar from './Avatar.vue'

export default {
  name: 'UserSmallCard',
  components: { UserAvatar },
  props: {
    user: {
      type: Object,
      required: true,
    },
    categories: {
      type: Array,
      // required: true,
      default: null,
    },
  },
  data() {
    return {
      loading: false,
      userData: {},
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser']),
    url() {
      if (this.userData.slug === this.loggedInUser.slug) {
        return '/user'
      }
      return '/user/' + this.userData._id
    },
    isFollowed() {
      return this.userData.followers.includes(this.loggedInUser.id)
    },
  },
  fetch() {
    this.userData = JSON.parse(JSON.stringify(this.user))
  },
  methods: {
    async follow() {
      this.loading = true
      const url = !this.isFollowed ? '/users/follow' : '/users/unfollow'
      await this.$axios.post(url, this.userData)
      if (this.isFollowed) {
        // eslint-disable-next-line vue/no-mutating-props
        this.userData.followers = this.userData.followers.filter((item) => {
          return item !== this.loggedInUser.id
        })
      } else {
        // eslint-disable-next-line vue/no-mutating-props
        this.userData.followers.push(this.loggedInUser.id)
      }
      this.loading = false
    },
  },
}
</script>

<style lang="scss" scoped>
.user-small-card {
  border: 1px $brand-grey solid;
  background-color: white;
  display: flex;
  min-width: 290px;
  border-radius: $rad;
  padding: $rad;
  margin-bottom: $rad;
  &--info {
    margin-left: $rad;
    margin-right: auto;
    display: flex;
    &_username {
      margin: auto;
      font-weight: bold;
      font-size: 16px;
    }
  }
}
</style>
