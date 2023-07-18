<template>
  <div></div>
</template>

<script>
export default {
  name: 'AdminIndex',
  layout: 'admin',
  middleware: ['auth', 'isMod'],
}
</script>

<style lang="scss" scoped></style>
