<template>
  <div class="all-tutos">
    <div class="all-tutos--header">
      <h3>Voici tous les tutos publiés sur TutoJunction !</h3>
      <hr />
      <div class="all-tutos--header--filters">
        <label>Trier par : </label>
        <select v-model="sorting" @change="changeSorting">
          <option value="latest">Les plus récents</option>
          <option value="byLikes">Les plus aimés</option>
          <option value="byViews">Les plus vus</option>
          <option value="byTime">Les courts à réaliser</option>
        </select>
      </div>
    </div>

    <Spinner-loader v-if="$fetchState.pending" />
    <div v-else class="all-tutos--listing">
      <client-only>
        <tuto-card v-for="tuto in articles" :key="tuto._id" :tuto="tuto" />
      </client-only>
    </div>
    <hr v-if="!$fetchState.pending" class="grey" />
    <div v-if="!$fetchState.pending" class="all-tutos--pagination">
      <button
        v-if="skip > 0"
        class="category-name link-style"
        @click="paginatePrev"
      >
        Précédents
      </button>
      <button
        v-if="articles.length === limit"
        class="category-name link-style"
        @click="paginateNext"
      >
        Suivants
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AllTutoIndex',

  data() {
    return {
      articles: [],
      skip: 0,
      limit: 20,
      sorting: 'latest',
      initialLoad: false,
    }
  },
  async fetch() {
    if (this.$route.query.sorting && !this.initialLoad) {
      const sorting = this.$route.query.sorting
      if (
        sorting === 'byLikes' ||
        sorting === 'byTime' ||
        sorting === 'byViews' ||
        sorting === 'latest'
      ) {
        this.sorting = sorting
      }
    }
    this.initialLoad = true
    const url =
      'articles/' + this.sorting + '?skip=' + this.skip + '&limit=' + this.limit
    try {
      const articles = await this.$axios.get(url)
      console.log(articles)
      this.articles = articles.data
    } catch (e) {
      this.$utils.consoleError('error:', e)
      await this.$error()
    }
  },
  methods: {
    paginatePrev() {
      this.skip = this.skip - this.limit
      this.$fetch()
    },
    paginateNext() {
      this.skip = this.skip + this.limit
      this.$fetch()
    },
    changeSorting() {
      console.log(this.sorting)
      this.skip = 0
      // this.sorting = method
      this.$fetch()
    },
  },
}
</script>

<style lang="scss" scoped>
.all-tutos {
  padding: $pad-min;
  display: flex;
  flex-direction: column;
  &--header {
    &--filters {
      margin-block: $pad-min;
      padding: $pad-min;
      border: 2px solid $brand-light-grey;
      border-radius: $rad;
    }
  }
  &--listing {
    justify-content: center;
    margin-inline: auto;
    display: flex;
    flex-wrap: wrap;
    gap: $pad-min;
    margin-block: $pad-min;
  }
}
</style>
