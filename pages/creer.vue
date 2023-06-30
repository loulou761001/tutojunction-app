<template>
  <div class="create app-inner">
    <form class="create--form" @submit.prevent="">
      <div class="create--form_field">
        <input
          v-model="articleData.title"
          :disabled="loading"
          type="text"
          placeholder="Le titre de ton article"
        />
      </div>
      <div>
        <EditorWysiwyg :loading="loading" @updateContent="updateContent" />
      </div>
      <input
        v-model="tagsString"
        :disabled="loading"
        type="text"
        placeholder="Le titre de ton article"
        @keydown="checkTagsLastChar"
      />
      <div v-if="articleData.tags.length > 0" class="create--form--tags-list">
        <span
          v-for="tag in articleData.tags"
          :key="tag"
          class="create--form--tags-list_tag category-name small"
          @click="removeTag(tag)"
          >{{ tag }} <span class="cross">🞤</span></span
        >
      </div>
      <select v-model="articleData.categories[0]">
        <option :value="null">Sélectionnez une catégorie</option>
        <option
          v-for="category in parentCategories"
          :key="category._id"
          :value="category._id"
        >
          {{ category.name }}
        </option>
      </select>
      <select v-model="articleData.categories[1]">
        <option :value="null">
          Sélectionnez une sous catégorie (optionnel)
        </option>
        <option
          v-for="category in childCategories"
          :key="category._id"
          :value="category._id"
        >
          {{ category.name }}
        </option>
      </select>
      <input type="submit" value="submit" class="btn" @click="sendArticle()" />
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import EditorWysiwyg from '../components/Editor/Wysiwyg.vue'

export default {
  name: 'Creer',
  components: { EditorWysiwyg },
  data() {
    return {
      loading: false,
      articleData: {
        content: '',
        title: '',
        tags: [],
        categories: [null, null],
      },
      tagsString: '',
      error: {
        tags: null,
        content: null,
        title: null,
      },
    }
  },
  watch: {},
  mounted() {
    console.log(this.$auth.getState('user'))
    console.log(this.$users.currentUser)
    this.$users.currentUser()
  },
  methods: {
    removeTag(tag) {
      // const index = this.articleData.tags.indexOf(tag)
      this.articleData.tags = this.articleData.tags.filter(
        (item) => item !== tag
      )
    },
    checkTagsLastChar(e) {
      this.error.tags = null
      const regex = /^[a-z\d\-_,\s]+$/i
      const key = e.key
      if (!regex.test(key)) {
        e.preventDefault()
      } else if (e.key === ',') {
        if (this.articleData.tags.length >= 12) {
          this.error.tags = 'tooMany'
          return
        }
        this.separateTags(e)
      }
    },
    separateTags(e) {
      const tag = this.tagsString.split(',')[0].trim()
      if (!this.articleData.tags.includes(tag) && tag.length > 0) {
        this.articleData.tags.push(this.tagsString.split(',')[0])
      }
      e.preventDefault()
      this.tagsString = ''
    },
    updateContent(value) {
      console.log(value)
      this.articleData.content = value
    },
    async sendArticle() {
      this.loading = true
      try {
        await this.$axios.post('/articles/create', this.articleData)
      } catch (e) {
        this.$utils.consoleLog('error uploading : ', e)
      } finally {
        this.loading = false
      }
    },
  },
  computed: {
    ...mapGetters({ getCategories: 'getCategories' }),
    parentCategories() {
      return this.getCategories.filter((item) => !item.parent)
    },
    childCategories() {
      return this.getCategories.filter(
        (item) => item.parent === this.articleData.categories[0]
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.create {
  &--form {
    padding-block: $pad-min;
    > * {
      margin-bottom: $pad-min;
    }
    &--tags-list {
      &_tag {
        cursor: pointer;
        .cross {
          display: inline-block;
          transform: rotate(45deg);
          color: $brand-grey;
        }
      }
    }
  }
}
</style>
