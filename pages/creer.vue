<template>
  <div class="create app-inner">
    <form class="create--form" @submit.prevent="sendArticle()">
      <div class="create--form_field">
        <input
          v-model="articleData.title"
          type="text"
          placeholder="Le titre de ton article"
        />
      </div>
      <div>
        <client-only>
          <EditorWysiwyg @input="updateContent" />
        </client-only>
      </div>
      <input type="submit" value="submot" class="btn" />
    </form>
  </div>
</template>

<script>
import EditorWysiwyg from '../components/Editor/Wysiwyg.vue'

export default {
  name: 'Creer',
  components: { EditorWysiwyg },
  data() {
    return {
      articleData: {
        content: '',
        title: '',
      },
    }
  },
  mounted() {
    console.log(this.$auth.getState('user'))
    console.log(this.$users.currentUser)
    this.$users.currentUser()
  },
  methods: {
    updateContent(value) {
      this.articleData.content = value
    },
    sendArticle() {
      this.$axios.post('/articles/create', this.articleData)
    },
  },
}
</script>

<style lang="scss" scoped></style>
