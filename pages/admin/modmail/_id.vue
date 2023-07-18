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
    <button
      v-if="response.trim().length"
      :disabled="mailLoading"
      class="btn"
      @click="sendMail"
    >
      Envoyer<spinner-loader v-if="mailLoading" />
    </button>
    <p v-if="mailSuccess">Réponse envoyée.</p>
  </div>
</template>

<script>
import PopupLoading from '../../../components/Popup/Loading.vue'
import UserSmallCard from '../../../components/User/SmallCard.vue'
import SpinnerLoader from '../../../components/SpinnerLoader.vue'

export default {
  name: 'ModmailSingle',
  components: { SpinnerLoader, UserSmallCard, PopupLoading },
  data() {
    return {
      message: {},
      error: false,
      response: '',
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
      this.mailSuccess = false
      this.mailLoading = true
      await this.$axios
        .post('modmail/email/', {
          message: this.message,
          response: this.response,
        })
        .then((data) => {
          console.log(data)
          this.mailSuccess = true
          this.response = ''
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
  &_textarea {
    margin-bottom: $pad-min;
  }
}
</style>
