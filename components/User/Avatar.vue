<template>
  <div :style="{ backgroundImage: 'url(' + avatar.url + ')' }"></div>
</template>

<script>
export default {
  name: 'UserAvatar',
  props: {
    avatar: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style scoped></style>
