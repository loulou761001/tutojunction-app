<template>
  <div class="app-sidebar">
    <img src="../assets/svg/Logo.svg" alt="Logo de TutoJunction" />
  </div>
</template>

<script>
export default {
  name: 'AppSidebarBasic',
}
</script>

<style lang="scss" scoped>
.app-sidebar {
  padding: $pad-large;
  background-color: $brand-yellow;

  min-width: 350px;
}
</style>
