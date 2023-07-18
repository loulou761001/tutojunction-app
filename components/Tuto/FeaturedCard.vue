<template>
  <nuxt-link :to="'/tuto/' + tuto._id" class="tuto-card">
    <div
      class="tuto-card_header"
      :style="{ backgroundImage: 'url(' + tuto.thumbnail.url + ')' }"
    >
      <h1 class="tuto-card_header_title">
        {{
          tuto.title.length > 16 ? tuto.title.slice(0, 16) + '...' : tuto.title
        }}
      </h1>
      <div class="tuto-card_header--meta">
        <nuxt-link
          v-for="(tag, index) in tuto.categories"
          :key="'Category ' + index"
          :to="'/categories/' + tag.slug"
          class="category-name"
          >{{ tag.name }}</nuxt-link
        >
        <nuxt-link
          v-for="(tag, index) in tuto.tags"
          :key="'Tag ' + index"
          :to="'/tags/' + tag"
          class="category-name"
          >{{ tag }}</nuxt-link
        >
      </div>
      <div class="flex" style="align-items: center; gap: 5px">
        <UserAvatar :avatar="tuto.author.avatar" /><span>{{
          tuto.author.username
        }}</span>
      </div>
    </div>
  </nuxt-link>
</template>

<script>
import categories from '../../pages/categories/index.vue'
import UserAvatar from '../User/Avatar.vue'

export default {
  name: 'TutoFeaturedCard',
  components: { UserAvatar },
  props: {
    tuto: {
      type: Object,
      required: true,
    },
    small: {
      type: Boolean,
      default: false,
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
  width: 100%;
  height: 300px;
  @include min-lg {
    height: 420px;
  }
  hr {
    border-color: $brand-grey;
  }
  &_header {
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    height: 100%;
    //margin-bottom: $pad-min;
    display: flex;
    flex-direction: column;
    position: relative;
    color: white;
    padding: $pad-min;
    &::after {
      z-index: 2;
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 60%;
      border-radius: $rad;
      background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
    }
    &--meta {
      padding-block: $rad;
      display: flex;
      flex-wrap: wrap;
      gap: $rad;
      > * {
        color: black;
      }
    }
    > * {
      z-index: 3;
      color: white;
    }
    &_title {
      margin: auto $rad 0;
    }
  }
  &--info {
    padding: $pad-min;
  }
}
</style>
