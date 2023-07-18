<template>
  <div class="admin-categories">
    <div class="admin-categories--header">
      <h4>Catégories du site :</h4>
    </div>
    <SpinnerLoader v-if="$fetchState.pending" />
    <div v-else class="admin-categories--messages">
      <nuxt-link
        v-for="cat in parents"
        :key="cat._id"
        :to="'/categories/' + cat.slug"
        target="_blank"
        class="admin-categories--messages_single"
      >
        <h5>{{ cat.name }}</h5>

        <div class="admin-categories--messages_single_children">
          <nuxt-link
            v-for="child in getChildren(cat._id)"
            :key="child._id"
            :to="'/categories/' + child.slug"
            class="category-name"
            ><span>{{ child.name }}</span>
            <font-awesome-icon
              icon="fa-solid fa-trash"
              class="delete-cat"
              @click.prevent="
                selectedCat = child._id
                popupOpen = true
              "
          /></nuxt-link>
        </div>
        <font-awesome-icon
          icon="fa-solid fa-trash"
          class="delete-cat"
          @click.prevent="
            selectedCat = cat._id
            popupOpen = true
          "
        />
      </nuxt-link>
    </div>
    <button class="btn dark" @click="popupCatOpen = true">
      Nouvelle catégorie
    </button>
    <popup-delete
      v-if="popupOpen"
      :loading="loading"
      :message="
        selectedCat.parent
          ? 'Ceci est irréversible !'
          : 'Ceci supprimera tous les articles dans cette catégorie !'
      "
      @close="
        selectedCat = null
        popupOpen = false
      "
      @delete="deleteCat(selectedCat)"
    />
    <popup-category
      v-if="popupCatOpen"
      :parents="parents"
      @close="popupCatOpen = false"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PopupDelete from '../../components/Popup/Delete.vue'
import PopupCategory from '../../components/Popup/Category.vue'

export default {
  name: 'AdminCategories',
  components: { PopupCategory, PopupDelete },
  layout: 'admin',
  middleware: ['auth', 'isMod'],
  data() {
    return {
      selectedCat: null,
      popupOpen: false,
      popupCatOpen: false,
      loading: false,
    }
  },
  async fetch() {},
  computed: {
    ...mapGetters({ categories: 'getCategories' }),
    parents() {
      return this.categories.filter((item) => !item.parent)
    },
  },
  methods: {
    async deleteCat(id) {
      this.loading = true
      await this.$axios
        .delete('categories/' + id)
        .then(() => {
          location.reload()
        })
        .catch((e) => {
          console.error(e)
          this.loading = false
        })
    },
    getChildren(id) {
      return this.categories.filter((item) => item.parent && item.parent === id)
    },
  },
}
</script>

<style lang="scss" scoped>
.admin-categories {
  padding: $pad-min;
  &--messages {
    border-radius: $rad;
    border: 1px solid $brand-grey;
    &_single {
      display: block;
      padding-inline: $pad-min;
      padding-block: $rad;
      &:not(:last-of-type) {
        border-bottom: 1px solid $brand-grey;
      }
      h5 {
        margin-bottom: $rad;
      }
      &_children {
        display: flex;
        flex-wrap: wrap;
        .category-name {
          align-items: center;
          display: flex;
          gap: $rad;
        }
      }
      .delete-cat {
        padding: $rad;
        background-color: $error-color;
        color: white;
        border-radius: 50%;
      }
    }
  }
}
</style>
