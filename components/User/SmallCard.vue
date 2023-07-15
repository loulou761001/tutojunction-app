<template>
  <nuxt-link :to="'/user/' + user.slug" class="user-small-card">
    <user-avatar :avatar="user.avatar" size="48px" />
    <div class="user-small-card--info">
      <span :title="user.username.length >= 24 ? user.username : null">{{
        user.username.length >= 24
          ? user.username.slice(0, 21) + '...'
          : user.username
      }}</span>
    </div>
    <button
      v-if="isAuthenticated"
      :disabled="loading"
      class="btn user-small-card--follow dark"
      @click="loading ? null : follow()"
    >
      {{ isFollowed ? 'Suivi' : 'Suivre' }}
    </button>
  </nuxt-link>
</template>
c

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
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser']),
    isFollowed() {
      return this.user.followers.includes(this.loggedInUser.id)
    },
  },
  methods: {
    async follow() {
      this.loading = true
      const url = !this.isFollowed ? '/users/follow' : '/users/unfollow'
      await this.$axios.post(url, this.user)
      if (this.isFollowed) {
        // eslint-disable-next-line vue/no-mutating-props
        this.user.followers = this.user.followers.filter((item) => {
          return item !== this.loggedInUser.id
        })
      } else {
        // eslint-disable-next-line vue/no-mutating-props
        this.user.followers.push(this.loggedInUser.id)
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
  border-radius: $rad;
  padding: $rad;
  margin-bottom: $rad;
  &--info {
    margin-left: $rad;
    margin-right: auto;
  }
}
</style>
