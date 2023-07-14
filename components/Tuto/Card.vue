<template>
  <nuxt-link :to="'/tuto/' + tuto._id" class="tuto-card">
    <div
      class="tuto-card_header"
      :style="{ backgroundImage: 'url(' + tuto.thumbnail.url + ')' }"
    ></div>
    <div class="tuto-card--info">
      <h4>{{ tuto.title }}</h4>
      <p>{{ new Date(tuto.created_at).toLocaleDateString('fr') }}</p>
    </div>
    <hr />
    <div class="tuto-card--meta">
      <TutoTag
        v-for="(tag, index) in tuto.categories"
        :key="'Category ' + index"
        :content="tag.name"
        :link="tag.slug"
      />
      <TutoTag
        v-for="(tag, index) in tuto.tags"
        :key="'Tag ' + index"
        :content="tag"
      />
    </div>
  </nuxt-link>
</template>

<script>
import categories from '../../pages/categories/index.vue'
import TutoTag from './Tag.vue'

export default {
  name: 'TutoCard',
  components: { TutoTag },
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
.tuto-card {
  display: block;
  border: 1px $brand-grey solid;
  border-radius: $rad;
  width: 25%;
  min-width: 200px;
  max-width: 260px;
  hr {
    border-color: $brand-grey;
  }
  &_header {
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    height: 160px;
    //margin-bottom: $pad-min;
    background-image: url('assets/imgs/card_placeholder.png');
  }
  &--info {
    padding: $pad-min;
  }
  &--meta {
    padding: $pad-min;
    display: flex;
    flex-wrap: wrap;
    gap: $rad;
  }
}
</style>
