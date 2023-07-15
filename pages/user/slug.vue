<template>
  <div class="user-index">
    {{ user.articles }}

    <div class="user-index--top">
      <UserAvatar
        :avatar="user.avatar"
        size="96px"
        class="user-index--top_avatar"
        @click.native="popupOpen = true"
      />
      <h3>{{ user.username }}</h3>
      <nuxt-link to="/logout" class="btn red">Se déconnecter</nuxt-link>
    </div>
    <div class="user-index--selector">
      <flicking :options="{ align: 'prev' }">
        <div
          ref="tabItem"
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
          ref="tabItem"
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
          ref="tabItem"
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
          ref="tabItem"
          class="user-index--selector_item"
          :class="{ active: currentTab === 'following' }"
          :style="{
            width: width,
          }"
          @click="currentTab = 'following'"
        >
          <span>Suit</span>
        </div>
        <div
          ref="tabItem"
          class="user-index--selector_item"
          :class="{ active: currentTab === 'followers' }"
          :style="{
            width: width,
          }"
          @click="currentTab = 'followers'"
        >
          <span>Le suivent</span>
        </div>
      </flicking>
    </div>
    <div v-if="currentTab === 'infos'" class="user-index--info">
      <div>
        <div class="user-index--info--field">
          <label for="username">Nom d'utilisateur : </label>
          <input v-model="user.username" :disabled="!editMode" type="text" />
        </div>
        <div class="user-index--info--field">
          <label for="email">Adresse e-mail : </label>
          <input v-model="user.email" :disabled="!editMode" type="email" />
        </div>
        <div class="user-index--info--field">
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
        Tu n'as pas encore publié d'article.
      </p>
      <h4 v-else>Voici les articles que tu as publiés :</h4>
      <div>
        <TutoCard v-for="tuto in user.articles" :key="tuto._id" :tuto="tuto" />
      </div>
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
import TutoCard from '../../components/Tuto/Card.vue'

export default {
  name: 'UserIndex',
  components: { TutoCard, UserAvatar, PopupMedia },
  data() {
    return {
      currentTab: 'infos',
      popupOpen: false,
      user: {},
      editMode: false,
    }
  },
  async fetch() {
    try {
      const user = await this.$axios.get(
        '/users/findById/' + this.loggedInUser.id
      )
      this.user = user.data
      console.log(this.user)
    } catch (err) {
      this.$utils.consoleError(err)
    }
  },
  computed: {
    ...mapGetters(['loggedInUser']),
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
  }
  &--selector {
    width: 100%;
    &_item {
      width: 33.3333%;
      min-width: 160px;
      text-align: center;
      padding-block: $rad;
      border-left: 1px solid $brand-light-grey;
      border-right: 1px solid $brand-light-grey;
      transition: $trans;
      &.active {
        font-weight: bold;
        border-bottom: 2px solid black;
      }
    }
  }
}
</style>
