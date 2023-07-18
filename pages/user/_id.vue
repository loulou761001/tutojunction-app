<template>
  <div v-if="$fetchState.pending">
    <SpinnerLoader />
  </div>
  <div v-else class="user-index">
    <div class="user-index--top">
      <UserAvatar
        :avatar="user.avatar"
        size="96px"
        class="user-index--top_avatar"
        @click.native="isMod ? (popupOpen = true) : null"
      />
      <h3>{{ user.username }}</h3>
      <button
        v-if="isAuthenticated"
        :disabled="loading"
        class="btn dark"
        @click="loading ? null : follow()"
      >
        {{ isFollowed ? 'Suivi' : 'Suivre' }}
      </button>
      <button
        v-if="isMod"
        :disabled="loading"
        class="btn red user-index--top_ban"
        @click="isBanned ? banUser('no') : (popupBanOpen = true)"
      >
        {{ !isBanned ? 'Bannir' : 'Débannir' }}
      </button>
    </div>
    <div class="user-index--selector">
      <flicking :options="{ align: 'prev' }">
        <div
          v-if="isMod"
          class="user-index--selector_item"
          :class="{ active: currentTab === 'infos' }"
          :style="{
            width: width,
          }"
          @click="currentTab = 'infos'"
        >
          <span>Informations</span>
        </div>
        <div
          class="user-index--selector_item"
          :class="{ active: currentTab === 'articles' }"
          :style="{
            width: width,
          }"
          @click="currentTab = 'articles'"
        >
          <span>Tutos publiés</span>
        </div>
        <div
          class="user-index--selector_item"
          :class="{ active: currentTab === 'likes' }"
          :style="{
            width: width,
          }"
          @click="currentTab = 'likes'"
        >
          <span>Tutos likés</span>
        </div>
        <div
          v-if="user.following.length"
          class="user-index--selector_item"
          :class="{ active: currentTab === 'following' }"
          :style="{
            width: width,
          }"
          @click="currentTab = 'following'"
        >
          <span>Il suit ({{ user.following.length }})</span>
        </div>
        <div
          v-if="user.followers.length"
          class="user-index--selector_item"
          :class="{ active: currentTab === 'followers' }"
          :style="{
            width: width,
          }"
          @click="currentTab = 'followers'"
        >
          <span>Le suivent ({{ user.followers.length }})</span>
        </div>
      </flicking>
    </div>
    <div v-if="currentTab === 'infos' && isMod" class="user-index--info">
      <div>
        <div class="user-index--info--field">
          <label for="username">Nom d'utilisateur : </label>
          <input v-model="user.username" :disabled="!editMode" type="text" />
        </div>
        <div v-if="isMod" class="user-index--info--field">
          <label for="email">Adresse e-mail : </label>
          <input v-model="user.email" :disabled="!editMode" type="email" />
        </div>
        <div v-if="isMod" class="user-index--info--field">
          <label for="name">Nom et prénom : </label>
          <input
            v-model="user.firstname"
            :disabled="!editMode"
            placeholder="Prénom"
            type="text"
          />
          <input
            v-model="user.lastname"
            :disabled="!editMode"
            placeholder="Nom"
            type="text"
          />
        </div>
      </div>
    </div>
    <div v-else-if="currentTab === 'articles'" class="user-index--articles">
      <p v-if="user.articles.length === 0">
        Cet utilisateur n'a pas encore publié de tuto.
      </p>
      <h4 v-else>Voici les tutos publiés par cet utilisateur :</h4>
      <div>
        <TutoCard v-for="tuto in user.articles" :key="tuto._id" :tuto="tuto" />
      </div>
    </div>
    <div v-else-if="currentTab === 'likes'" class="user-index--articles">
      <p v-if="user.liked_articles.length === 0">
        Cet utilisateur n'a pas encore aimé de tuto.
      </p>
      <h4 v-else>Voici les tutos aimés par cet utilisateur :</h4>
      <div>
        <TutoCard
          v-for="tuto in user.liked_articles"
          :key="tuto._id"
          :tuto="tuto"
        />
      </div>
    </div>
    <div v-else-if="currentTab === 'followers'" class="user-index--users">
      <user-small-card v-if="isFollowed" :user="loggedInUser" />
      <user-small-card
        v-for="item in otherFollowers"
        :key="item._id"
        :user="item"
      />
    </div>
    <div v-else-if="currentTab === 'following'" class="user-index--users">
      <user-small-card v-if="isFollowing" :user="loggedInUser" />
      <user-small-card
        v-for="item in otherFollowing"
        :key="item._id"
        :user="item"
      />
    </div>
    <popup-media
      v-if="popupOpen"
      category="profile"
      @close="popupOpen = false"
      @selectImg="updatePic"
    />
    <popup-ban
      v-if="popupBanOpen"
      category="profile"
      :loading="loading"
      @close="popupBanOpen = false"
      @ban="banUser"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PopupMedia from '../../components/Popup/Media.vue'
import UserAvatar from '../../components/User/Avatar.vue'
import TutoCard from '../../components/Tuto/Card.vue'
import UserSmallCard from '../../components/User/SmallCard.vue'
import SpinnerLoader from '../../components/SpinnerLoader.vue'

export default {
  name: 'UserSingle',
  components: {
    SpinnerLoader,
    UserSmallCard,
    TutoCard,
    UserAvatar,
    PopupMedia,
  },
  data() {
    return {
      loading: false,
      currentTab: 'articles',
      popupOpen: false,
      popupBanOpen: false,
      user: {},
      userEdit: {},
      editMode: false,
    }
  },
  async fetch() {
    try {
      const user = await this.$axios.get(
        '/users/findById/' + this.$route.params.id
      )
      const likedArticles = await this.$axios.get(
        '/articles/findByUserLikes/' + this.$route.params.id
      )
      this.user = user.data
      this.user.liked_articles = likedArticles.data
      if (this.user._id === this.loggedInUser.id) {
        await this.$router.push('/user/')
      }
    } catch (err) {
      this.$utils.consoleError(err)
    }
  },
  computed: {
    ...mapGetters(['loggedInUser', 'isAuthenticated', 'isMod']),
    otherFollowers() {
      return this.user.followers.filter(
        (item) => item._id !== this.loggedInUser.id
      )
    },
    otherFollowing() {
      return this.user.following.filter(
        (item) => item._id !== this.loggedInUser.id
      )
    },
    isFollowed() {
      return this.user.followers
        .map((item) => item._id)
        .includes(this.loggedInUser.id)
    },
    isBanned() {
      return this.user.banned
    },
    isFollowing() {
      return this.user.following
        .map((item) => item._id)
        .includes(this.loggedInUser.id)
    },
    width() {
      if (process.client) {
        return (
          100 /
            document.getElementsByClassName('user-index--selector_item')
              .length +
          '%'
        )
      }
      return '200px'
    },
  },

  methods: {
    toggleEditMode() {
      if (this.editMode) {
        this.userEdit = this.user
      } else {
        this.user = this.userEdit
      }
      this.editMode = !this.userEdit
    },
    async follow() {
      this.loading = true
      const url = !this.isFollowed ? '/users/follow' : '/users/unfollow'
      await this.$axios.post(url, this.user)
      if (this.isFollowed) {
        // eslint-disable-next-line vue/no-mutating-props
        this.user.followers = this.user.followers.filter((item) => {
          return item._id !== this.loggedInUser.id
        })
      } else {
        const loggedInUser = this.loggedInUser
        loggedInUser._id = this.loggedInUser.id
        // eslint-disable-next-line vue/no-mutating-props
        this.user.followers.push(loggedInUser)
      }
      this.loading = false
    },
    async banUser(message) {
      this.popupBanOpen = false
      console.log(message)
      this.loading = true
      const url = !this.isBanned ? '/users/ban' : '/users/unBan'
      await this.$axios.post(url, { user: this.user, message })
      if (this.isBanned) {
        // eslint-disable-next-line vue/no-mutating-props
        this.user.banned = false
      } else {
        // eslint-disable-next-line vue/no-mutating-props
        this.user.banned = true
      }
      this.loading = false
    },
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
    &_ban {
      //margin-top: $pad-min !important;
    }
    button {
      width: 50%;
      min-width: 200px;
      margin: auto;
      margin-top: $pad-min;
    }
  }
  &--selector {
    width: 100%;
    &_item {
      cursor: pointer;
      width: 33.3333%;
      min-width: 160px;
      text-align: center;
      padding-block: $pad-min;
      border-left: 1px solid $brand-light-grey;
      border-right: 1px solid $brand-light-grey;
      transition: $trans;
      &.active {
        font-weight: bold;
        border-bottom: 2px solid black;
      }
    }
  }
  &--infos {
    display: flex;
    flex-wrap: wrap;
    gap: $pad-min;
    padding: $pad-min;
  }
  &--articles {
    h4 {
      width: 100%;
    }
    display: flex;
    flex-wrap: wrap;
    gap: $pad-min;
    padding: $pad-min;
  }
  &--users {
    display: flex;
    flex-direction: column;
    gap: $pad-min;
    padding: $pad-min;
  }
}
</style>
