<template>
  <div>
    <HeaderComp />
    <nuxt />
  </div>
</template>

<script>
import HeaderComp from '../components/Header.vue'

export default {
  name: 'Default',
  components: { HeaderComp },
}
</script>

<style scoped></style>
