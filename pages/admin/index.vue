<template>
  <SpinnerLoader v-if="$fetchState.pending" />
  <div v-else class="admin-index">
    <h1>Bienvenue dans l'administration de TutoJunction !</h1>
    <hr />
    <h3>Nous avons :</h3>
    <hr class="grey" />
    <div class="admin-index--field">
      <h3>{{ infos.users }} utilisateurs,</h3>
      <h4>
        dont {{ infos.writerUsers }} rédacteur{{
          infos.writerUsers > 1 ? 's' : ''
        }}
        certifié{{ infos.writerUsers > 1 ? 's' : ''
        }}{{ infos.bannedUsers > 1 ? 's' : '' }}, et
        {{ infos.bannedUsers }} banni{{ infos.bannedUsers > 1 ? 's' : '' }}.
      </h4>
      <hr class="grey" />
    </div>
    <div class="admin-index--field">
      <h3>{{ infos.articles }} articles,</h3>
      <h4>avec {{ infos.comments }} commentaires,</h4>
      <h3>dans {{ infos.categories }} catégories différentes.</h3>
    </div>
  </div>
</template>

<script>
import SpinnerLoader from '../../components/SpinnerLoader.vue'

export default {
  name: 'AdminIndex',
  components: { SpinnerLoader },
  layout: 'admin',
  middleware: ['auth', 'isMod'],
  data() {
    return {
      infos: {},
    }
  },
  async fetch() {
    try {
      const infos = await this.$axios.get('articles/admin/main_infos')
      this.infos = infos.data
    } catch (e) {
      this.$utils.consoleError(e)
      this.$error()
    }
  },
}
</script>

<style lang="scss" scoped>
.admin-index {
  padding: $pad-min;
}
</style>
