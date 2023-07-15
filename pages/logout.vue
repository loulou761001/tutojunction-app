<template>
  <div></div>
</template>

<script>
export default {
  name: 'Logout',
  mounted() {
    let url
    if (this.$route.query.banned) {
      url = '/login?banned=1'
    } else {
      url = '/login'
    }
    this.$auth
      .logout()
      .then(() => this.$router.push(url))
      .catch((err) => {
        console.log(err)
      })
  },
}
</script>

<style lang="scss" scoped></style>
