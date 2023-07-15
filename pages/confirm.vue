<template>
  <div class="confirm">
    <p v-if="error">Une erreur est survenue</p>
    <div v-else-if="success">
      <p>
        Ton compte a été confirmé, tu vas être redirigé dans quelques secondes.
      </p>
      <p>
        <nuxt-link to="/"
          >Clique ici si tu n'es pas redirigé automatiquement.</nuxt-link
        >
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Confirm',
  data() {
    return {
      error: false,
      success: false,
    }
  },
  computed: {
    ...mapGetters(['loggedInUser']),
  },
  mounted() {
    if (!this.$route.query.code) {
      this.error = true
      this.$utils.consoleLog('no code')
      return
    }
    const code = this.$route.query.code

    let user = localStorage.getItem('user')
    user = JSON.parse(user)
    if (!user) {
      user = this.loggedInUser
      user._id = user.id
    }
    this.$utils.consoleLog(user)
    if (user.confirmed) {
      this.$router.push('/')
      return
    }
    console.log('user', user._id)
    this.error = false
    this.$axios
      .get('/users/findById/' + user._id)
      .then((data) => {
        console.log(data.data)
        const maxDate = new Date(data.data.confirmation_code_time)
        maxDate.setHours(maxDate.getHours() + 2)
        this.$utils.consoleLog(maxDate)
        if (data.data.confirmation_code === code && new Date() < maxDate) {
          this.$utils.consoleLog('ok')
          this.$axios
            .put('/users/confirm/' + user._id)
            .then((data) => {
              this.$utils.consoleLog(data)
              this.error = false
              this.success = true
              this.$auth.fetchUser()
              setTimeout(() => {
                this.$router.push('/')
              }, 4000)
            })
            .catch((err) => {
              this.$utils.consoleLog(err)
              this.error = true
            })
        } else {
          this.$utils.consoleLog('not ok')
          this.error = true
        }
      })
      .catch((err) => {
        this.error = true
        this.$utils.consoleLog(err)
      })
  },
}
</script>

<style scoped></style>
