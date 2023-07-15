<template>
  <div class="user-index">
    <div class="user-index--top">
      <UserAvatar
        :avatar="user.avatar"
        size="96px"
        class="user-index--top_avatar"
        @click.native="popupOpen = true"
      />
      <h3>{{ user.username }}</h3>
    </div>
    <popup-media
      v-if="popupOpen"
      category="profile"
      @close="popupOpen = false"
      @selectImg="updatePic"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PopupMedia from '../../components/Popup/Media.vue'
import UserAvatar from '../../components/User/Avatar.vue'

export default {
  name: 'UserIndex',
  components: { UserAvatar, PopupMedia },
  data() {
    return {
      popupOpen: false,
      user: {},
    }
  },
  computed: {
    ...mapGetters(['loggedInUser']),
  },
  methods: {
    updatePic(img) {
      this.$axios
        .put('users/editProfile', { avatar: img._id })
        .then(() => {
          this.$auth.fetchUser()
          this.$auth.refreshTokens()
          this.popupOpen = false
          this.user.avatar = img
        })
        .catch((e) => {
          this.$utils.consoleError(e)
        })
    },
  },
  async fetch() {
    try {
      const user = await this.$axios.get(
        '/users/findById/' + this.loggedInUser.id
      )
      this.user = user.data
    } catch (err) {
      this.$utils.consoleError(err)
    }
  },
}
</script>

<style lang="scss" scoped>
.user-index {
  &--top {
    background-color: $brand-light-grey;
    padding: $pad-min;
    text-align: center;
    display: flex;
    flex-direction: column;
    &_avatar {
      margin: auto;
      cursor: pointer;
      span {
        height: 96px;
        margin: auto;
      }
    }
  }
}
</style>
