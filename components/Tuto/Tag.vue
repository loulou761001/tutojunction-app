<template>
  <span v-if="!link" class="tuto-tag">
    {{ content }}
  </span>
  <nuxt-link v-else :to="link" class="tuto-tag">
    {{ content }}
  </nuxt-link>
</template>

<script>
export default {
  name: 'TutoTag',
  props: {
    content: {
      required: true,
      type: String,
    },
    link: {
      default: null,
      type: String,
    },
  },
}
</script>

<style lang="scss" scoped>
.tuto-tag {
  padding-block: 2px;
  padding-inline: $rad;
  background-color: $brand-light-grey;
  border-radius: $rad;
  font-size: 14px;
}
</style>
