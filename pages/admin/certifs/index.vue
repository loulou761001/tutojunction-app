<template>
  <div class="admin-modmail">
    <div class="admin-modmail--header">
      <h4>Demandes de certifications :</h4>
    </div>
    <SpinnerLoader v-if="$fetchState.pending" />
    <div v-else class="admin-modmail--messages">
      <nuxt-link
        v-for="message in messages"
        :key="message._id"
        :to="'/admin/certifs/' + message._id"
        class="admin-modmail--messages_single"
      >
        <span>par : {{ message.author.username }} | </span>
        <span>{{ message.object }} | </span>
        <span :class="{ error: !message.open }">{{
          message.open ? 'lu' : 'non-lu'
        }}</span>
      </nuxt-link>
    </div>
    <div class="admin-modmail--pagination">
      <button
        v-if="skip > 0"
        class="category-name link-style"
        @click="paginatePrev"
      >
        Précédents
      </button>
      <button
        v-if="messages.length === 20"
        class="category-name link-style"
        @click="paginateNext"
      >
        Suivants
      </button>
    </div>
  </div>
</template>

<script>
import SpinnerLoader from '../../../components/SpinnerLoader.vue'

export default {
  name: 'AdminModmail',
  components: { SpinnerLoader },
  layout: 'admin',
  middleware: ['auth', 'isModMiddleware'],
  data() {
    return {
      messages: [],
      filter: 'messages',
      skip: 0,
    }
  },
  async fetch() {
    await this.$axios
      .get('modmail/certifs?skip=' + this.skip)
      .then((data) => {
        this.messages = data.data
      })
      .catch((e) => {
        console.log(e)
      })
  },
  methods: {
    paginateNext() {
      this.skip = this.skip + 20
      this.$fetch()
    },
    paginatePrev() {
      this.skip = this.skip - 10
      this.$fetch()
    },
  },
}
</script>

<style lang="scss" scoped>
.admin-modmail {
  padding: $pad-min;
  &--messages {
    border-radius: $rad;
    border: 1px solid $brand-grey;
    min-width: 560px;
    overflow: auto;
    &_single {
      display: block;
      padding: $pad-min;
      &:not(:last-of-type) {
        border-bottom: 1px solid $brand-grey;
      }
    }
  }
}
</style>
