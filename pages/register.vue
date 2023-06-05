<template>
  <form @submit.prevent="register">
    <label for="email">Email</label>
    <input v-model="newUser.email" type="email" name="email" />
    <label for="username">Username</label>
    <input v-model="newUser.username" type="text" name="username" />
    <label for="password">Password</label>
    <input v-model="newUser.password" type="password" name="password" />
    <input type="submit" value="submit" />
  </form>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      newUser: {
        email: '',
        username: '',
        password: '',
      },
    }
  },
  methods: {
    register() {
      this.$axios
        .get('/users')
        .then((data) => {
          console.log(data)
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },
}
</script>

<style scoped></style>
