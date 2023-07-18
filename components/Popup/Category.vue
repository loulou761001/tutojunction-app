<template>
  <component :is="'PopupBase'" class="popup-delete">
    <div class="close" @click="$emit('close')">
      <font-awesome-icon icon="fa-xmark" size="xl" />
    </div>
    <div class="popup-delete--content">
      <p>Entre le nom de la catégorie :</p>
      <p v-if="error">Une erreur est survenue</p>
      <input
        v-model="name"
        type="text"
        placeholder="Nom de la catégorie"
        style="width: 100%"
      />
      <select v-model="parent" style="width: 100%; margin-block: 15px">
        <option :value="null">Aucun</option>
        <option v-for="parent in parents" :key="parent._id" :value="parent._id">
          {{ parent.name }}
        </option>
      </select>
      <button
        v-if="!loading"
        :disabled="name.trim().length === 0"
        class="btn"
        @click="createCat()"
      >
        Créer
      </button>
      <button v-if="!loading" class="btn" @click="$emit('close')">
        Annuler
      </button>
      <SpinnerLoader v-else />
    </div>
  </component>
</template>

<script>
import SpinnerLoader from '../SpinnerLoader.vue'

export default {
  name: 'PopupCategory',
  components: { SpinnerLoader },
  props: {
    parents: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      name: '',
      loading: false,
      error: false,
      parent: null,
    }
  },
  computed: {},
  methods: {
    async createCat() {
      this.loading = false
      await this.$axios
        .post('categories/create', { name: this.name, parent: this.parent })
        .then((data) => {
          console.log(data)
          this.$emit('close')
          location.reload()
        })
        .catch((e) => {
          console.error(e)
          this.error = true
        })
        .finally(() => {
          this.loading = false
        })
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
