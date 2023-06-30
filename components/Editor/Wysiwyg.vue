<template>
  <div class="wysiwyg">
    <client-only>
      <editor
        v-model="content"
        :disabled="loading"
        api-key="2rfhq0mgca0ycshwuo4kq8spmchrpro3f9obni5vg74ncw2a"
        :init="{
          height: 500,
          menubar: false,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount',
          ],
          toolbar:
            'undo redo | formatselect | bold italic backcolor | \
           alignleft aligncenter alignright alignjustify | \
           bullist numlist outdent indent | removeformat | help',
        }"
      />
    </client-only>
  </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue'
import { config } from '@fortawesome/fontawesome-svg-core'
export default {
  name: 'EditorWysiwyg',
  components: {
    editor: Editor,
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      content: '',
    }
  },

  watch: {
    content: function () {
      this.$emit('updateContent', this.content)
    },
  },
  mounted() {},

  beforeDestroy() {},
  methods: {
    config() {
      return config
    },
  },
}
</script>

<style lang="scss" scoped></style>
