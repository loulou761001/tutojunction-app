<template>
  <div class="search-page">
    <div class="search-page--top">
      <h4>
        Voici les résultats de votre recherche pour : "{{
          $route.query.query.trim()
        }}"
      </h4>
      <p>
        Vous pouvez affiner votre recherche en sélectionnant une catégorie ici :
      </p>
      <div class="search-page--top_categories">
        <span
          v-for="cat in parentCategories"
          :key="cat._id"
          class="category-name"
          :class="{ selected: selectedCat[0] === cat._id }"
          @click="setCat(cat)"
          >{{ cat.name }}</span
        >
      </div>
      <div v-if="selectedCat[0]" class="search-page--top_categories">
        <span
          v-for="cat in childCategoriesToShow"
          :key="cat._id"
          class="category-name"
          :class="{ selected: selectedCat[1] === cat._id }"
          @click="setSubCat(cat)"
          >{{ cat.name }}</span
        >
      </div>
      <div class="search-page--top_buttons">
        <button class="btn" @click="$fetch()">Appliquer les filtres</button>
        <button
          class="btn"
          @click="
            selectedCat = [null, null]
            $fetch()
          "
        >
          Réinitialiser les filtres
        </button>
      </div>
    </div>
    <hr />
    <div class="search-page--results">
      <h4 v-if="hits.length === 0 && !searchLoading" class="error">
        Aucun résultat pour ta recherche...
      </h4>
      <TutoItem v-for="tuto in hits" :key="tuto._id" :tuto="tuto" />
      <div>
        <button v-if="skip !== 0" class="btn small" @click="paginatePrev">
          Précédents
        </button>
        <button
          v-if="hits.length === 10"
          class="btn small"
          @click="paginateNext"
        >
          Suivants
        </button>
      </div>
    </div>
    <popup-loading v-if="searchLoading" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import PopupLoading from '../components/Popup/Loading.vue'
import loading from '../components/Popup/Loading.vue'

export default {
  name: 'Search',
  components: { PopupLoading },
  data() {
    return { skip: 0, searchLoading: true, selectedCat: [null, null], hits: [] }
  },
  async fetch() {
    this.searchLoading = true
    await this.$axios
      .post(`/articles/search`, {
        searchQuery: this.$route.query.query.trim(),
        limit: 10,
        skip: this.skip,
        category: this.selectedCat[0],
        categorySub: this.selectedCat[1],
      })
      .then((response) => {
        this.hits = response.data
        this.$utils.consoleLog(this.hits)
      })
      .catch((err) => {
        this.$utils.consoleError('error', err)
      })
      .finally(() => {
        this.searchLoading = false
      })
  },
  computed: {
    ...mapGetters(['loggedInUser', 'isAuthenticated']),
    loading() {
      return loading
    },
    ...mapGetters(['getCategories']),
    parentCategories() {
      return this.getCategories.filter((item) => !item.parent)
    },
    childCategories() {
      return this.getCategories.filter((item) => item.parent)
    },
    childCategoriesToShow() {
      return this.childCategories.filter(
        (item) => item.parent === this.selectedCat[0]
      )
    },
  },
  watch: {
    '$route.query.query': {
      handler: function () {
        this.$fetch()
      },
    },
  },
  mounted() {
    if (!this.isAuthenticated || !this.loggedInUser.confirmed) {
      this.setConfPopupOpen(true)
    }
  },

  methods: {
    ...mapActions(['setConfPopupOpen']),
    paginateNext() {
      this.skip = this.skip + 10
      this.$fetch()
    },
    paginatePrev() {
      this.skip = this.skip - 10
      this.$fetch()
    },
    setCat(category) {
      this.$set(this.selectedCat, 0, category._id)
      this.$set(this.selectedCat, 1, null)
    },
    setSubCat(category) {
      this.$set(this.selectedCat, 1, category._id)
    },
  },
}
</script>

<style lang="scss" scoped>
.search-page {
  padding: $pad-min;
  &--top {
    h4 {
      margin-block: $pad-min;
    }
    &_categories {
      margin-top: $pad-min;
    }
    &_buttons {
      margin-block: $pad-min;
    }
  }
  &--results {
    width: 100%;
    justify-content: space-around;
    gap: $pad-min;
  }
}
</style>
