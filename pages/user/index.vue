<template>
  <div v-if="$fetchState.pending">
    <SpinnerLoader />
  </div>
  <div v-else class="user-index">
    <div class="user-index--top">
      <UserAvatar
        :avatar="user.avatar ? user.avatar : null"
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
          <span>Je suis</span>
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
          <span>Ils me suivent</span>
        </div>
      </flicking>
    </div>
    <div v-if="currentTab === 'infos'" class="user-index--info">
      <div class="user-index--info--field" :class="{ disabled: !editMode }">
        <label for="username">Nom d'utilisateur : </label>
        <input v-model="user.username" :disabled="!editMode" type="text" />
        <p v-if="errors.username && editMode" class="error">
          {{ errorMessage('username')[errors.username] }}
        </p>
      </div>
      <div class="user-index--info--field" :class="{ disabled: !editMode }">
        <label for="email">Adresse e-mail : </label>
        <input v-model="user.email" :disabled="!editMode" type="email" />
        <p v-if="errors.email && editMode" class="error">
          {{ errorMessage('email')[errors.email] }}
        </p>
      </div>
      <div class="user-index--info--field" :class="{ disabled: !editMode }">
        <label for="name">Prénom et nom : </label>
        <input
          v-model="user.firstname"
          :disabled="!editMode"
          placeholder="Prénom"
          type="text"
        />
        <p v-if="errors.firstname && editMode" class="error">
          {{ errorMessage('firstname')[errors.firstname] }}
        </p>
        <input
          v-model="user.lastname"
          :class="{ disabled: !editMode }"
          :disabled="!editMode"
          placeholder="Nom"
          type="text"
        />
        <p v-if="errors.lastname && editMode" class="error">
          {{ errorMessage('lastname')[errors.lastname] }}
        </p>
      </div>
      <button v-if="!loading" class="btn" @click="toggleEditMode">
        {{ editMode ? 'Annuler' : 'Modifier mon profil' }}
      </button>
      <button v-if="editMode && !loading" class="btn" @click="saveChanges">
        Sauvegarder
      </button>
      <SpinnerLoader v-if="loading" />
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
      <user-small-card
        v-for="item in user.followers"
        :key="item._id"
        :user="item"
      />
    </div>
    <div v-else-if="currentTab === 'following'" class="user-index--users">
      <user-small-card
        v-for="item in user.following"
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PopupMedia from '../../components/Popup/Media.vue'
import UserAvatar from '../../components/User/Avatar.vue'
import TutoCard from '../../components/Tuto/Card.vue'
import SpinnerLoader from '../../components/SpinnerLoader.vue'

export default {
  name: 'UserIndex',
  components: { SpinnerLoader, TutoCard, UserAvatar, PopupMedia },
  data() {
    return {
      email: {
        rules: {
          required: true,
          maxLength: 128,
          minLength: 6,
        },
      },
      username: {
        rules: {
          required: true,
          maxLength: 36,
          minLength: 6,
        },
      },
      firstname: {
        rules: {
          required: true,
          maxLength: 36,
          minLength: 2,
        },
      },
      lastname: {
        rules: {
          required: true,
          maxLength: 36,
          minLength: 2,
        },
      },
      errors: {
        status: false,
      },
      loading: false,
      currentTab: 'infos',
      popupOpen: false,
      user: {},
      originalUser: {},
      editMode: false,
    }
  },
  async fetch() {
    try {
      const user = await this.$axios.get(
        '/users/findById/' + this.loggedInUser.id
      )
      const likedArticles = await this.$axios.get(
        '/articles/findByUserLikes/' + this.loggedInUser.id
      )
      this.user = user.data
      this.user.liked_articles = likedArticles.data
    } catch (err) {
      this.$utils.consoleError(err)
    }
  },
  computed: {
    ...mapGetters(['loggedInUser']),

    isFollowed() {
      return this.user.followers
        .map((item) => item._id)
        .includes(this.loggedInUser.id)
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
    errorMessage(key) {
      return {
        tooLong:
          'Trop long ! (' + this[key].rules.maxLength + ' caractères max)',
        tooShort:
          'Trop court ! (' + this[key].rules.minLength + ' caractères min)',
        wrongFormat: 'Format incorrect',
        taken: 'Déjà pris !',
      }
    },
    async saveChanges() {
      const newUser = {
        username: this.user.username,
        email: this.user.email,
        firstname: this.user.firstname,
        lastname: this.user.lastname,
      }
      this.errors.status = false
      const regexUsername = /^[a-zA-Z0-9-_]+$/
      const regexName = /^[A-Za-z-]+$/
      if (!regexUsername.test(newUser.username)) {
        this.errors.username = 'wrongFormat'
        this.errors.status = true
      }
      if (!regexName.test(newUser.firstname)) {
        this.errors.firstname = 'wrongFormat'
        this.errors.status = true
      }
      if (!regexName.test(newUser.lastname)) {
        this.errors.lastname = 'wrongFormat'
        this.errors.status = true
      }
      Object.keys(newUser).forEach((key) => {
        if (newUser[key].length > this[key].rules.maxLength) {
          this.errors[key] = 'tooLong'
          this.errors.status = true
        } else if (newUser[key].length < this[key].rules.minLength) {
          this.errors[key] = 'tooShort'
          this.errors.status = true
        }
      })
      if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(newUser.email)) {
        this.errors.status = true
        this.errors.email = 'wrongFormat'
      }

      if (this.errors.status) return
      let emailTaken
      let usernameTaken
      try {
        if (this.originalUser.email !== newUser.email) {
          emailTaken = await this.$axios.post('users/checkEmail', {
            email: newUser.email,
          })
          if (!emailTaken.data) {
            this.errors.email = 'taken'
            this.errors.status = true
          }
        }
        if (this.originalUser.username !== newUser.username) {
          usernameTaken = await this.$axios.post('users/checkUsername', {
            username: newUser.username,
          })
          if (!usernameTaken.data) {
            this.errors.username = 'taken'
            this.errors.status = true
          }
        }
      } catch (e) {
        this.$utils.consoleLog(e)
      }

      console.log(this.errors)
      if (this.errors.status) return
      this.loading = true
      if (this.originalUser.email === newUser.email) {
        delete newUser.email
      }
      this.$axios
        .put('/users/editProfile', newUser)
        .then(async (data) => {
          await this.$auth.fetchUser()
          this.$utils.consoleLog(data)
          this.editMode = false
        })
        .catch((e) => {
          this.$utils.consoleError(e)
        })
        .finally(() => {
          this.loading = false
        })
    },
    toggleEditMode() {
      if (!this.editMode) {
        this.originalUser = JSON.parse(JSON.stringify(this.user))
      } else {
        this.user = JSON.parse(JSON.stringify(this.originalUser))
      }
      this.editMode = !this.editMode
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
  &--info {
    display: flex;
    flex-direction: column;
    gap: $pad-min;
    padding: $pad-min;
    input:disabled {
      background-color: white;
    }
    &--field {
      margin: auto;
      display: flex;
      flex-direction: column;
      gap: $rad;
      label {
        font-weight: bold;
      }
      > * {
        text-align: center;
        margin: auto;
      }
    }
    .btn {
      margin: auto;
      width: 50%;
      min-width: 200px;
    }
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
