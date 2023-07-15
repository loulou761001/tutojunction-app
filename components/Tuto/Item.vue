<template>
  <nuxt-link :to="'/tuto/' + tuto._id" class="tuto-item">
    <div
      class="tuto-item_thumbnail"
      :style="{ backgroundImage: 'url(' + tuto.thumbnail.url + ')' }"
    ></div>
    <div class="tuto-item--info">
      <h4 :title="tuto.title.length > 48 ? tuto.title : null">
        {{
          tuto.title.length > 48 ? tuto.title.slice(0, 48) + '...' : tuto.title
        }}
      </h4>
      <p>{{ new Date(tuto.created_at).toLocaleDateString('fr') }}</p>
      <hr />
      <div class="tuto-item--meta">
        <nuxt-link
          v-for="(tag, index) in tuto.categories"
          :key="'Category ' + index"
          :to="'/categories/' + tag.slug"
          class="category-name small"
          >{{ tag.name }}</nuxt-link
        >
        <nuxt-link
          v-for="(tag, index) in tuto.tags"
          :key="'Tag ' + index"
          :to="'/tags/' + tag"
          class="category-name small"
          >{{ tag }}</nuxt-link
        >
      </div>
    </div>
  </nuxt-link>
</template>

<script>
import categories from '../../pages/categories/index.vue'

export default {
  name: 'TutoItem',
  props: {
    tuto: {
      type: Object,
      required: true,
    },
  },
  computed: {
    categories() {
      return categories
    },
  },
}
</script>

<style lang="scss" scoped>
.tuto-item {
  display: flex;
  border: 1px $brand-grey solid;
  border-radius: $rad;
  width: 100%;
  min-height: 120px;
  margin-bottom: $pad-min;
  hr {
    border-color: $brand-grey;
  }
  &_thumbnail {
    border-radius: $rad;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    width: 120px;
    margin-right: $pad-min;
    //margin-bottom: $pad-min;
    display: flex;

    &_title {
      z-index: 3;
      color: white;
      margin: auto $rad $rad;
    }
  }
  &--info {
    width: 100%;
    padding: $pad-min;
  }
  &--meta {
    display: flex;
    flex-wrap: wrap;
    gap: $rad;
  }
}
</style>
