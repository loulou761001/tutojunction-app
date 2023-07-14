<template>
  <component :is="'PopupBase'" class="popup-media">
    <SpinnerLoader />
  </component>
</template>

<script>
export default {
  name: 'PopupLoading',
}
</script>

<style lang="scss" scoped>
.popup-media {
  &--header {
  }
  &--images {
    display: flex;
    gap: $rad;
    flex-wrap: wrap;
    &_single {
      max-width: 125px;
      border-radius: $rad;
      position: relative;
      transition: $trans;
      img {
        border-radius: $rad;
      }
      //max-height: 200px;
      &:after {
        transition: $trans;
        content: '';
        display: block;

        position: absolute;
        top: $rad;
        right: $rad;
        outline: 2px solid $brand-yellow;
        border-radius: 50%;
        width: 15px;
        height: 15px;
        z-index: inherit;
      }
      &.selected {
        img {
          outline: 2px solid $brand-yellow;
        }

        &:after {
          color: white;
          outline-color: $brand-orange;
          background-color: $brand-yellow;
        }
      }
    }
  }
}
</style>
