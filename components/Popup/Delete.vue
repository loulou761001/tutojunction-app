<template>
  <component :is="'PopupBase'" class="popup-delete">
    <div class="close" @click="$emit('close')">
      <font-awesome-icon icon="fa-xmark" size="xl" />
    </div>
    <div class="popup-delete--content">
      <p>Es-tu sûr de vouloir supprimer cet élément ?</p>
      <p v-if="message">{{ message }}</p>
      <button v-if="!loading" class="btn red" @click="$emit('delete')">
        oui, supprimer
      </button>
      <button v-if="!loading" class="btn" @click="$emit('close')">non</button>
      <SpinnerLoader v-else />
    </div>
  </component>
</template>

<script>
import SpinnerLoader from '../SpinnerLoader.vue'

export default {
  name: 'PopupDelete',
  components: { SpinnerLoader },
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
    message: {
      type: String,
      default: null,
    },
  },
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
