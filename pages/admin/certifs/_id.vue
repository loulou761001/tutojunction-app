<template>
  <popup-loading v-if="$fetchState.pending" />
  <div v-else-if="error" class="single-modmail">
    <h2>erreur, message introuvable</h2>
    <nuxt-link to="/admin/modmail">Retour aux messages</nuxt-link>
  </div>
  <div v-else class="single-modmail">
    <user-small-card :user="message.author" />
    <h3>{{ message.object }}</h3>
    <hr />
    <p>{{ message.content }}</p>
    <hr />
    <h4>Répondre à cet utilisateur :</h4>
    <textarea v-model="response" class="single-modmail_textarea"></textarea>
    <div
      v-if="response.trim().length && !mailSuccess"
      class="single-modmail_choice"
    >
      <input type="radio" name="choice" @click="accept = true" />
      <label>Accepter la demande |</label>
      <input type="radio" name="choice" @click="accept = false" />
      <label>Refuser la demande</label>
    </div>
    <p v-if="acceptError" class="error">Veuillez cocher une réponse.</p>
    <button
      v-if="response.trim().length && !mailSuccess"
      :disabled="mailLoading"
      class="btn"
      @click="sendMail"
    >
      Envoyer<spinner-loader v-if="mailLoading" />
    </button>
    <p v-if="mailSuccess">Réponse envoyée, tu vas être redirigé.</p>
  </div>
</template>

<script>
import PopupLoading from '../../../components/Popup/Loading.vue'
import UserSmallCard from '../../../components/User/SmallCard.vue'
import SpinnerLoader from '../../../components/SpinnerLoader.vue'

export default {
  name: 'ModmailSingle',
  components: { SpinnerLoader, UserSmallCard, PopupLoading },
  layout: 'admin',
  middleware: ['auth', 'isModMiddleware'],
  data() {
    return {
      message: {},
      error: false,
      response: '',
      accept: null,
      acceptError: false,
      mailLoading: false,
      mailSuccess: false,
    }
  },
  async fetch() {
    await this.$axios
      .get('modmail/message/' + this.$route.params.id)
      .then((data) => {
        console.log(data.data)
        this.message = data.data
      })
      .catch((e) => {
        console.log(e)
        this.error = true
      })
  },
  methods: {
    async sendMail() {
      if (this.accept === null) {
        this.acceptError = true
        return
      }
      this.acceptError = false
      this.mailSuccess = false
      this.mailLoading = true
      await this.$axios
        .post('modmail/answerCertif/', {
          message: this.message,
          response: this.response,
          certif: this.accept,
        })
        .then((data) => {
          console.log(data)
          this.mailSuccess = true
          this.response = ''
          setTimeout(async () => {
            await this.deleteMessage()
          }, 5000)
        })
        .catch((e) => {
          console.error(e)
        })
        .finally(() => {
          this.mailLoading = false
        })
    },
    async deleteMessage() {
      this.mailSuccess = false
      this.mailLoading = true
      await this.$axios
        .delete('modmail/message/' + this.$route.params.id)
        .then((data) => {
          console.log(data)
          this.$router.back()
        })
        .catch((e) => {
          console.error(e)
        })
        .finally(() => {
          this.mailLoading = false
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.single-modmail {
  padding: $pad-min;
  display: flex;
  flex-direction: column;
  &_choice {
    display: flex;
    align-items: center;
    gap: $rad;
    font-weight: bold;
    margin-bottom: $pad-min;
  }
  &_textarea {
    margin-bottom: $pad-min;
  }
  .btn {
    margin-bottom: $pad-min;
  }
}
</style>
