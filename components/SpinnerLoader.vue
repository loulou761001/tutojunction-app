<template>
  <div class="spinner_container">
    <font-awesome-icon
      icon="fa-solid fa-circle-notch"
      class="spinner rotate"
      size="lg"
      :style="{ color: iconColor }"
    />
  </div>
</template>

<script>
export default {
  name: 'SpinnerLoader',
  props: {
    iconColor: {
      type: String,
      default: '#000000',
    },
  },
}
</script>

<style lang="scss" scoped>
.spinner {
  margin-inline: auto;

  &_container {
    display: flex;
    width: 100%;
    height: 100%;
  }
}
</style>
