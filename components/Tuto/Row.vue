<template>
  <div class="tuto-row">
    <div v-if="title">
      <h3>{{ title }}</h3>
      <hr />
    </div>
    <client-only>
      <flicking :options="{ align: 'prev' }">
        <TutoCard
          v-for="(tuto, index) in tutos"
          :key="index"
          :tuto="tuto"
          :small="small"
        />
      </flicking>
    </client-only>
  </div>
</template>

<script>
export default {
  name: 'TutoRow',
  props: {
    tutos: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      default: null,
    },
    small: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped></style>
