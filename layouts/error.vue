<template>
  <div class="error">
    <h1 v-if="error.statusCode === 404">Page introuvable</h1>
    <h1 v-else>Une erreur est survenue</h1>

    <NuxtLink to="/"><TjLogo /> | Retour à la page d'accueil</NuxtLink>
  </div>
</template>

<script>
import TjLogo from '../components/TjLogo.vue'

export default {
  components: { TjLogo },
  props: ['error'],
}
</script>

<style lang="scss" scoped>
.error {
  padding: $pad-min;
  a {
    display: flex;
    align-items: center;
  }
}
</style>
