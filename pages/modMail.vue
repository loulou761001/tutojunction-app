<template>
  <div class="modmail">
    <form class="modmail--form" @submit.prevent="sendModMail()">
      <h4 class="modmail--form_title">
        Envoie un message à l'équipe de TutoJunction !
      </h4>
      <p v-if="error.status" class="error modmail--form--field">
        {{ errorMessage[error.message] }}
      </p>
      <select v-model="modMail.object" class="modmail--form--field" required>
        <option :value="null" disabled>Sélectionne un object</option>
        <option :value="'feedback'">Retours sur ton expérience</option>
        <option :value="'question'">Question</option>
        <option :value="'bug'">Bug</option>
        <option v-if="loggedInUser.role === 'user'" :value="'certif'">
          Je veux être certifié
        </option>
      </select>
      <textarea
        v-model="modMail.content"
        class="modmail--form--field"
        placeholder="Entre le contenu de ton message"
      >
      </textarea>
      <div
        v-if="charsLeft"
        class="modmail--form--field char-counter"
        :class="{ error: charsLeft.tooLong }"
      >
        {{ charsLeft.text }}
      </div>
      <input type="submit" class="btn dark" value="Envoyer" />
    </form>
    <popup-loading v-if="loading" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PopupLoading from '../components/Popup/Loading.vue'

export default {
  name: 'ModMail',
  components: { PopupLoading },
  data() {
    return {
      loading: false,
      characters: {
        min: 16,
        max: 1200,
      },
      errorMessage: {
        noObject: 'Sélectionne un objet',
        tooLong: 'Ton commentaire est trop long ! (1200 caractères max)',
        tooShort: 'Ton commentaire est trop court ! (16 caractères min)',
      },
      error: {
        status: false,
        message: null,
      },
      modMail: {
        object: null,
        content: '',
      },
    }
  },
  computed: {
    ...mapGetters(['loggedInUser']),
    charsLeft() {
      if (process.client) {
        const tmp = document.createElement('DIV')
        tmp.innerHTML = this.modMail.content
        // return tmp.textContent || tmp.innerText || '';
        return {
          text: `${tmp.innerText.length}/${this.characters.max}`,
          contentLength: tmp.innerText.length,
          tooLong: tmp.innerText.length > this.characters.max,
        }
      }
      return null
    },
  },
  mounted() {
    if (this.$route.query.certif) {
      this.modMail.object = 'certif'
    }
  },
  methods: {
    sendModMail() {
      this.modMail.content = this.modMail.content.trim()
      this.error.status = false
      this.error.message = null
      if (!this.modMail.object) {
        this.error.status = true
        this.error.message = 'noObject'
      } else if (this.modMail.content.length < this.characters.min) {
        this.error.status = true
        this.error.message = 'tooShort'
      } else if (this.modMail.content.length > this.characters.max) {
        this.error.status = true
        this.error.message = 'tooLong'
      }
      if (!this.error.status) {
        this.loading = true
        this.modMail.author = this.loggedInUser.id
        this.$axios
          .post('/modmail', this.modMail)
          .then((data) => {
            this.$utils.consoleLog(data)
            this.$router.back()
          })
          .catch((err) => {
            this.$utils.consoleError(err)
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.modmail {
  &--form {
    display: flex;
    flex-direction: column;
    padding: $pad-min;
    &_title {
      text-align: center;
    }
    &--field {
      width: 100%;
      max-width: 576px;
      margin-inline: auto;
      margin-block: $pad-min;
      display: flex;
      flex-direction: column;
      &.char-counter {
        margin-top: 0;
      }
    }
    .btn {
      max-width: 264px;
      margin: auto;
    }
  }
}
</style>
