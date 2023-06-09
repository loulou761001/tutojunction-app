<template>
  <div>
    <editor-content :editor="editor" />
  </div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'
import { Placeholder } from '@tiptap/extension-placeholder'

export default {
  name: 'EditorWysiwyg',
  components: {
    EditorContent,
  },

  data() {
    return {
      editor: null,
    }
  },
  watch: {
    value(value) {
      // HTML
      const isSame = this.editor.getHTML() === value

      // JSON
      // const isSame = JSON.stringify(this.editor.getJSON()) === JSON.stringify(value)

      if (isSame) {
        return
      }

      this.editor.commands.setContent(value, false)
    },
  },
  mounted() {
    this.editor = new Editor({
      content: '',
      editorProps: {
        attributes: {
          class: 'text-input',
        },
      },
      placeholder: 'Entre le contenu de ton article ici',
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder: 'My Custom Placeholder',
        }),
      ],
      onUpdate: () => {
        // HTML
        console.log(this.editor.getHTML())
        this.$emit('input', this.editor.getHTML())

        // JSON
        // this.$emit('input', this.editor.getJSON())
      },
    })
  },

  beforeDestroy() {
    this.editor.destroy()
  },
}
</script>

<style lang="scss" scoped></style>
