<template>
  <img
    class="logo"
    src="~/assets/svg/Logo.svg"
    alt="Logo de Tutorial Junction"
  />
</template>

<script>
export default {
  name: 'TjLogo',
}
</script>

<style lang="scss" scoped>
.logo {
  width: 40px;
  height: 40px;

  z-index: 10;
  @include min-sm {
    width: 80px;
    height: 80px;
  }
}
</style>
