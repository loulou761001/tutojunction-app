<template>
  <form
    class="app-inner register-form"
    autocomplete="off"
    @submit.prevent="checkForm"
  >
    <div class="register-form--field">
      <label for="email">Email :</label>
      <input v-model="newUser.email.value" type="email" name="email" />
    </div>
    <div class="register-form--field">
      <label for="username">Username :</label>
      <input
        v-model="newUser.username.value"
        type="text"
        name="username"
        minlength="3"
        maxlength="36"
      />
    </div>
    <div class="register-form--field">
      <label for="password">Password :</label>
      <input v-model="newUser.password.value" type="password" name="password" />
    </div>
    <div class="register-form--field submit">
      <input type="submit" value="Je m'inscris !" class="btn" />
    </div>
  </form>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      newUser: {
        email: {
          value: '',
          rules: {
            required: true,
            maxLength: 36,
            minLength: 6,
          },
        },
        username: {
          value: '',
          rules: {
            required: true,
            maxLength: 36,
            minLength: 6,
          },
        },
        password: {
          value: '',
          rules: {
            required: true,
            maxLength: 36,
            minLength: 6,
          },
        },
      },
    }
  },
  methods: {
    async checkForm() {
      const error = {}
      Object.keys(this.newUser).forEach((k) => {
        if (this.newUser[k].value.trim().length === 0) {
          error[k] = { type: 'empty' }
        } else {
          this.newUser[k].value = this.newUser[k].value.trim()
        }
      })
      if (Object.keys(error).length === 0) {
        const emailAvailable = await this.$axios.post('/users/checkEmail', {
          email: this.newUser.email.value,
        })
        const usernameAvailable = await this.$axios.post(
          '/users/checkUsername',
          { username: this.newUser.username.value }
        )
        if (!emailAvailable) {
          error.email = { type: 'taken' }
        }
        if (!usernameAvailable) {
          error.username = { type: 'taken' }
        }
      }
      console.log('errors', error)
      if (Object.keys(error).length === 0) {
        this.register()
      }
    },
    register() {
      const user = this.newUser
      Object.keys(user).forEach(function (key, index) {
        user[key] = user[key].value
      })
      console.log(this.newUser)
      console.log('new user', user)
      this.$axios
        .post('/users/register', user)
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

<style lang="scss" scoped>
.register-form {
  display: flex;
  flex-direction: column;
  &--field {
    width: 100%;
    max-width: 576px;
    margin-inline: auto;
    margin-block: $pad-min;
    display: flex;
    flex-direction: column;
    &.submit {
      .btn {
        margin-inline: auto;
      }
    }
  }
}
</style>
