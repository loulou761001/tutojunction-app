<template>
  <nuxt-link :to="'/tuto/' + tuto._id" class="tuto-card">
    <div
      class="tuto-card_header"
      :class="{ small: small }"
      :style="{ backgroundImage: 'url(' + tuto.thumbnail.url + ')' }"
    >
      <h4 v-if="small" class="tuto-card_header_title">
        {{
          tuto.title.length > 16 ? tuto.title.slice(0, 16) + '...' : tuto.title
        }}
      </h4>
    </div>
    <div v-if="!small" class="tuto-card--info">
      <h4 :title="tuto.title.length > 16 ? tuto.title : null">
        {{
          tuto.title.length > 16 ? tuto.title.slice(0, 16) + '...' : tuto.title
        }}
        <font-awesome-icon
          v-if="tuto.featured === true"
          icon="fa-solid fa-star"
          style="color: #ffcd29"
          title="Sélectionné par notre équipe"
        />
      </h4>
      <p>
        {{ new Date(tuto.published_at).toLocaleDateString('fr') }},
        {{
          new Date(tuto.published_at).toLocaleTimeString('fr', {
            hour: '2-digit',
            minute: '2-digit',
          })
        }}
      </p>
      <span class="category-name" style="margin-block: 5px; margin-left: 0">
        <font-awesome-icon
          style="color: #cfcfcf; margin-right: 5px"
          icon="fa-solid fa-clock"
        />{{ tuto.time_required[0] }}:{{ tuto.time_required[1] < 10 ? '0' : ''
        }}{{ tuto.time_required[1] }}
      </span>
      <div class="flex" style="align-items: center; gap: 5px">
        <UserAvatar :avatar="tuto.author.avatar" /><span>{{
          tuto.author.username
        }}</span>
      </div>
    </div>
    <hr v-if="!small" />
    <div v-if="!small" class="tuto-card--meta">
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
  </nuxt-link>
</template>

<script>
import categories from '../../pages/categories/index.vue'
import UserAvatar from '../User/Avatar.vue'

export default {
  name: 'TutoCard',
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
  border-radius: $rad;
  width: 25%;
  min-width: 200px;
  max-width: 260px;
  &:not(:last-child) {
    margin-right: $pad-min;
  }
  hr {
    border-color: $brand-grey;
  }
  &_header {
    border-radius: $rad;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    height: 160px;
    //margin-bottom: $pad-min;
    display: flex;
    position: relative;
    &.small::after {
      z-index: 2;
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 80%;
      border-radius: $rad;
      background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
    }

    &_title {
      z-index: 3;
      color: white;
      margin: auto $rad $rad;
    }
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
