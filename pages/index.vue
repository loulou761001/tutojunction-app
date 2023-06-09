<template>
  <div>
    <p>frfe</p>
    <button @click="checkLoggedIn">Check logged in</button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'IndexPage',
  auth: false,
  fetch() {
    console.log(this.$auth.strategy.token.get())
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser']),
  },
  mounted() {
    console.log(this.$store.getters.loggedInUser)
    this.$utils.consoleLog(process.env.NODE_ENV)
  },

  methods: {
    checkLoggedIn() {
      console.log('test')
      this.$axios
        .get('/users/checkLoggedIn')
        .then((data) => {
          console.log(data)
        })
        .catch((e) => {
          console.error(e)
        })
    },
  },
}
</script>
