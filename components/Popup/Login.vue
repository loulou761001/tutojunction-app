<template>
  <component :is="'PopupBase'" class="popup-media">
    <div class="close" @click="$emit('close')">
      <font-awesome-icon icon="fa-xmark" size="xl" />
    </div>
    <p>Tu dois être connecté pour faire ça !</p>
    <p>
      <nuxt-link to="/login">Clique ici pour te connecter</nuxt-link> ou
      <nuxt-link to="/register"
        >là pour créer un compte chez TutoJuction.</nuxt-link
      >
    </p>
  </component>
</template>

<script>
export default {
  name: 'PopupLogin',
}
</script>

<style lang="scss" scoped>
p {
  text-align: center;
}
</style>
