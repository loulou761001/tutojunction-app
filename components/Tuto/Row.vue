<template>
  <div class="tuto-row">
    <div v-if="title">
      <h3>{{ title }}</h3>
      <hr />
    </div>
    <flicking :options="{ align: 'prev' }">
      <tuto-card v-for="tuto in tutos" :key="tuto._id" :tuto="tuto" />
    </flicking>
  </div>
</template>

<script>
import TutoCard from './Card.vue'

export default {
  name: 'TutoRow',
  components: { TutoCard },
  props: {
    tutos: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      default: null,
    },
  },
}
</script>

<style scoped></style>
