<template>
  <div
    v-if="avatar"
    :style="{
      backgroundImage: 'url(' + avatar.url + ')',
      width: size,
      height: size,
    }"
    class="avatar"
  ></div>
  <div
    v-else
    :style="{
      width: size,
      height: size,
    }"
    class="avatar"
  >
    <img src="~/assets/svg/avatar-default.svg" alt="" />
  </div>
</template>

<script>
export default {
  name: 'UserAvatar',
  props: {
    avatar: {
      type: Object,
      default: null,
      required: false,
    },
    size: {
      type: String,
      default: '32px',
    },
  },
}
</script>

<style lang="scss" scoped>
.avatar {
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: 2px solid $brand-grey;
  border-radius: 50%;
  background-color: $brand-yellow;
  img {
    margin-top: 8px;
  }
}
</style>
