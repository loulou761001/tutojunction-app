<template>
  <div class="admin-tutos">
    <div class="admin-tutos--header">
      <h4>Derniers tutos :</h4>
      <div class="admin-tutos--header--filters">
        <div class="admin-tutos--header--filters--filter">
          <input
            v-model="filters.unpublished"
            type="checkbox"
            :disabled="$fetchState.pending"
            @change="$fetch()"
          />
          <label>Uniquement les tutos non-publiés</label>
        </div>
      </div>
    </div>
    <SpinnerLoader v-if="$fetchState.pending" />
    <div v-else class="admin-tutos--tutos">
      <nuxt-link
        v-for="article in articles"
        :key="article._id"
        target="_blank"
        :to="'/tuto/' + article._id"
        class="admin-tutos--tutos_single"
      >
        <span
          >par :
          <nuxt-link
            :to="'/user/' + article.author._id"
            target="_blank"
            class="category-name"
            >{{ article.author.username }}</nuxt-link
          >
          |
        </span>
        <span
          >{{
            article.title.length > 24
              ? article.title.slice(0, 22) + '...'
              : article.title
          }}
          |
        </span>
        <span
          >{{ new Date(article.created_at).toLocaleDateString('fr') }},
          {{
            new Date(article.created_at).toLocaleTimeString('fr', {
              hour: '2-digit',
              minute: '2-digit',
            })
          }}
          |
        </span>
        <span :class="{ error: !article.published_at }">{{
          article.published_at ? 'Publié' : 'En attente'
        }}</span>
      </nuxt-link>
    </div>
    <div class="admin-tutos--pagination">
      <button
        v-if="skip > 0"
        class="category-name link-style"
        @click="paginatePrev"
      >
        Précédents
      </button>
      <button
        v-if="articles.length === 16"
        class="category-name link-style"
        @click="paginateNext"
      >
        Suivants
      </button>
    </div>
  </div>
</template>

<script>
import SpinnerLoader from '../../components/SpinnerLoader.vue'

export default {
  name: 'AdminTutos',
  components: { SpinnerLoader },
  layout: 'admin',
  middleware: ['auth', 'isModMiddleware'],
  data() {
    return {
      articles: [],
      filter: 'messages',
      skip: 0,
      filters: {
        unpublished: false,
      },
    }
  },
  async fetch() {
    let url = 'articles/admin?skip=' + this.skip
    if (this.filters.unpublished) {
      url = url + '&unpublished=true'
    }
    await this.$axios
      .get(url)
      .then((data) => {
        this.articles = data.data
      })
      .catch((e) => {
        console.log(e)
      })
  },
  methods: {
    paginateNext() {
      this.skip = this.skip + 16
      this.$fetch()
    },
    paginatePrev() {
      this.skip = this.skip - 16
      this.$fetch()
    },
  },
}
</script>

<style lang="scss" scoped>
.admin-tutos {
  padding: $pad-min;
  &--header {
    &--filters {
      margin-top: $pad-min;
      &--filter {
        display: flex;
        align-items: center;
        gap: $rad;
        input {
          width: 24px;
          height: 24px;
        }
      }
    }

    margin-bottom: $pad-demi;
  }
  &--tutos {
    border-radius: $rad;
    border: 1px solid $brand-grey;
    min-width: 560px;
    overflow: auto;

    &_single {
      display: block;
      padding: $pad-min;
      &:not(:last-of-type) {
        border-bottom: 1px solid $brand-grey;
      }
    }
  }
}
</style>
