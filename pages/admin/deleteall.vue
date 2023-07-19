<template>
  <div></div>
</template>

<script>
export default {
  name: 'AdmindeleteAll',
  layout: 'admin',
  middleware: ['auth', 'isModMiddleware'],
  async fetch() {
    try {
      await this.$axios.delete('articles/admin/delete_all')
      console.log('ok')
      this.$router.back()
    } catch (e) {
      console.error(e)
    }
  },
}
</script>

<style scoped></style>
