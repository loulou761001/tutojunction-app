<template>
  <div class="register">
    <div class="register--top app-inner">
      <h1>Crée ton compte chez Tuto Junction !</h1>
      <p v-if="!registerSuccess">
        En créant ton compte chez nous, accède à toutes nos fonctionnalités,
        rédige, commente et note des articles, et rejoins l'aventure
        Tuto Junction !
      </p>
      <p v-else>
        Un lien pour confirmer ton compte t'a été envoyé sur
        {{ newUser.email.value }}, n'oublie pas de consulter tes spams si tu ne
        reçois pas l'e-mail !
      </p>
    </div>
    <form
      v-if="!registerSuccess"
      class="app-inner register-form"
      autocomplete="off"
      @submit.prevent="checkForm"
    >
      <div class="register-form--field">
        <label for="username">Nom d'utilisateur :</label>
        <input
          v-model="newUser.username.value"
          :disabled="loading"
          type="text"
          name="username"
          :minlength="newUser.username.rules.minLength"
          :maxlength="newUser.username.rules.maxLength"
        />
        <p v-if="errors.username" class="error">{{ errors.username.type }}</p>
      </div>
      <div class="register-form--field">
        <label for="username">Prénom :</label>
        <input
          v-model="newUser.firstname.value"
          :disabled="loading"
          type="text"
          name="username"
          :minlength="newUser.firstname.rules.minLength"
          :maxlength="newUser.firstname.rules.maxLength"
        />
        <p v-if="errors.firstname" class="error">{{ errors.firstname.type }}</p>
      </div>
      <div class="register-form--field">
        <label for="username">Nom :</label>
        <input
          v-model="newUser.lastname.value"
          :disabled="loading"
          type="text"
          name="username"
          :minlength="newUser.lastname.rules.minLength"
          :maxlength="newUser.lastname.rules.maxLength"
        />
        <p v-if="errors.lastname" class="error">{{ errors.lastname.type }}</p>
      </div>
      <div class="register-form--field">
        <label for="email">Adresse e-mail :</label>
        <input
          v-model="newUser.email.value"
          :disabled="loading"
          type="email"
          name="email"
        />
        <p v-if="errors.email" class="error">{{ errors.email.type }}</p>
      </div>
      <div class="register-form--field">
        <label for="password">Mot de passe :</label>
        <input
          v-model="newUser.password.value"
          :minlength="newUser.password.rules.minLength"
          :maxlength="newUser.password.rules.maxLength"
          :disabled="loading"
          type="password"
          name="password"
        />
        <p v-if="errors.password" class="error">{{ errors.password.type }}</p>
      </div>
      <div class="register-form--field submit">
        <input
          v-if="!loading"
          type="submit"
          value="Je m'inscris !"
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
  name: 'Register',
  data() {
    return {
      registerSuccess: false,
      newUser: {
        email: {
          value: '',
          rules: {
            required: true,
            maxLength: 64,
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
        firstname: {
          value: '',
          rules: {
            required: true,
            maxLength: 36,
            minLength: 2,
          },
        },
        lastname: {
          value: '',
          rules: {
            required: true,
            maxLength: 36,
            minLength: 2,
          },
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
      errors: {},
    }
  },
  methods: {
    async checkForm() {
      this.errors = {}
      const regexUsername = /^[a-zA-Z0-9-_]+$/
      const nameUsername = /^[A-Za-z-]+$/
      if (!regexUsername.test(this.newUser.username.value)) {
        this.errors.username = { type: 'invalidFormat' }
      }
      if (!nameUsername.test(this.newUser.firstname.value)) {
        this.errors.firstname = { type: 'invalidFormat' }
      }
      if (!nameUsername.test(this.newUser.lastname.value)) {
        this.errors.lastname = { type: 'invalidFormat' }
      }
      Object.keys(this.newUser).forEach((k) => {
        this.newUser[k].value = this.newUser[k].value.trim()
        if (this.newUser[k].value.length === 0) {
          this.errors[k] = { type: 'empty' }
        } else if (
          this.newUser[k].value.length > this.newUser[k].rules.maxLength
        ) {
          this.errors[k] = { type: 'tooLong' }
        } else if (
          this.newUser[k].value.length < this.newUser[k].rules.minlength
        ) {
          this.errors[k] = { type: 'tooShort' }
        }
      })

      if (Object.keys(this.errors).length === 0) {
        this.loading = true
        const emailAvailable = await this.$axios.post('/users/checkEmail', {
          email: this.newUser.email.value,
        })
        const usernameAvailable = await this.$axios.post(
          '/users/checkUsername',
          { username: this.newUser.username.value }
        )
        if (!emailAvailable.data) {
          this.errors.email = { type: 'taken' }
        }
        if (!usernameAvailable.data) {
          this.errors.username = { type: 'taken' }
        }
      }
      this.$utils.consoleLog('errors', this.errors)
      if (Object.keys(this.errors).length === 0) {
        this.register()
      } else {
        this.loading = false
      }
    },
    register() {
      const user = JSON.parse(JSON.stringify(this.newUser))
      Object.keys(user).forEach(function (key, index) {
        user[key] = user[key].value
      })
      this.$utils.consoleLog('new user', user)
      this.$axios
        .post('/users/register', user)
        .then((data) => {
          this.$utils.consoleLog('data', data)
          data.data.password = null
          this.loading = false
          this.registerSuccess = true
          localStorage.setItem('user', JSON.stringify(data.data))
        })
        .catch((err) => {
          this.$utils.consoleLog(err)
          this.loading = false
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.register {
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
  .register-form {
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
