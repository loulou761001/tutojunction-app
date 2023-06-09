<template>
  <div></div>
</template>

<script>
export default {
  name: 'Logout',
  mounted() {
    this.$auth
      .logout()
      .then(() => this.$router.push('/login'))
      .catch((err) => {
        console.log(err)
      })
  },
}
</script>

<style lang="scss" scoped></style>
