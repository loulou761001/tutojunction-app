<template>
  <div class="login app-inner">
    <div class="login--top">
      <h1>Connecte toi à ton compte !</h1>
      <p v-if="!loginSuccess">
        En créant ton compte chez nous, accède à toutes nos fonctionnalités,
        rédige, commente et note des articles, et rejoins l'aventure
        TutoJunction !
      </p>
      <p v-else>
        Heureux de te revoir, tu vas être redirigé à l'accueil dans quelques
        secondes.
      </p>
    </div>
    <form
      v-if="!loginSuccess"
      class="login-form"
      autocomplete="off"
      @submit.prevent="checkForm"
    >
      <p v-if="error.length > 0" class="error">{{ error }}</p>
      <div class="login-form--field">
        <label for="email">Adresse e-mail :</label>
        <input
          v-model="formInfo.email.value"
          :disabled="loading"
          type="email"
          name="email"
        />
      </div>
      <div class="login-form--field">
        <label for="password">Mot de passe :</label>
        <input
          v-model="formInfo.password.value"
          :minlength="formInfo.password.rules.minLength"
          :maxlength="formInfo.password.rules.maxLength"
          :disabled="loading"
          type="password"
          name="password"
        />
      </div>
      <div class="login-form--field submit">
        <input
          v-if="!loading"
          type="submit"
          value="Je me connecte !"
          :disabled="loading"
          class="btn dark"
        />
        <font-awesome-icon
          v-else
          icon="fa-solid fa-circle-notch"
          class="spinner rotate"
          size="lg"
          style="color: #000000"
        />
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginSuccess: false,
      formInfo: {
        email: {
          value: '',
        },
        password: {
          value: '',
          rules: {
            required: true,
            maxLength: 64,
            minLength: 8,
          },
        },
      },
      loading: false,
      error: '',
    }
  },
  methods: {
    checkForm() {
      this.error = ''
      Object.keys(this.formInfo).forEach((k) => {
        this.formInfo[k].value = this.formInfo[k].value.trim()
        if (this.formInfo[k].value.length === 0) {
          this.error = 'empty'
        }
      })

      if (this.error.length === 0) {
        this.loading = true
        this.login()
      } else {
        this.$utils.consoleLog('errors', this.error)
        this.loading = false
      }
    },
    login() {
      const user = JSON.parse(JSON.stringify(this.formInfo))
      Object.keys(user).forEach(function (key, index) {
        user[key] = user[key].value
      })
      this.$utils.consoleLog('login info', user)
      this.$auth
        .login({ data: user })
        .then((data) => {
          console.log(data)
          this.$utils.consoleLog('data', data)
          this.loading = false
          this.loginSuccess = true
          // localStorage.setItem('user', data.data)

          // .catch((err) => console.log(err))
        })
        .catch((err) => {
          console.log(err)
          if (err.response) {
            const errorCode = err.response.status
            this.$utils.consoleLog(err.response)
            if (errorCode === 403) {
              this.error = 'banned'
            } else if (errorCode === 400) {
              this.error = 'wrong'
            }
          }

          this.loading = false
        })
      // this.$axios
      // .post('/users/login', user)
      // .then((data) => {
      //   console.log(data)
      //   this.$auth.login(data.data).then((data) => {
      //     this.$utils.consoleLog('data', data)
      //     this.loading = false
      //     this.loginSuccess = true
      //     localStorage.setItem('user', data.data)
      //   })
      //   // .catch((err) => console.log(err))
      // })
      // .catch((err) => {
      //   console.log(err)
      //   if (err.response) {
      //     const errorCode = err.response.status
      //     this.$utils.consoleLog(err.response)
      //     if (errorCode === 403) {
      //       this.error = 'banned'
      //     } else if (errorCode === 400) {
      //       this.error = 'wrong'
      //     }
      //   }
      //
      //   this.loading = false
      // })
    },
  },
}
</script>

<style lang="scss" scoped>
.login {
  &--top {
    max-width: 576px;

    margin: auto auto $pad-min;
    padding-top: $pad-min;

    h1 {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: $pad-min;
    }
    text-align: center;
  }
  .login-form {
    display: flex;
    flex-direction: column;
    padding-bottom: $pad-min;
    &--field {
      width: 100%;
      max-width: 576px;
      margin-inline: auto;
      margin-block: $pad-min;
      display: flex;
      flex-direction: column;
      .error {
        margin-block: $rad;
        font-size: 14px;
        color: red;
      }
      &.submit {
        .btn,
        .spinner {
          margin-inline: auto;
        }
      }
    }
  }
}
</style>
