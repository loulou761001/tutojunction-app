<template>
  <component :is="'PopupBase'" class="popup-delete">
    <div class="close" @click="$emit('close')">
      <font-awesome-icon icon="fa-xmark" size="xl" />
    </div>
    <div class="popup-delete--content">
      <p>Es-tu sûr de vouloir supprimer cet élément ?</p>
      <button v-if="!loading" class="btn" @click="$emit('delete')">
        oui, supprimer
      </button>
      <button v-if="!loading" class="btn" @click="$emit('close')">non</button>
      <SpinnerLoader v-else />
    </div>
  </component>
</template>

<script>
import SpinnerLoader from '../SpinnerLoader.vue'

export default {
  name: 'PopupDelete',
  components: { SpinnerLoader },
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      images: [],
      uploadMode: false,
      fileToUpload: null,
      skip: 0,
      selectedImage: null,
    }
  },
  async fetch() {
    this.selectedImage = null
    const category = this.category === 'articles' ? 'article' : 'profile'
    await this.$axios
      .get('/files/popup/?category=' + category + '&limit=10&skip=' + this.skip)
      .then((data) => {
        this.$utils.consoleLog('media', data)
        this.images = data.data
      })
      .catch((err) => {
        this.$utils.consoleError(err)
      })
  },
  computed: {
    headers() {
      return {
        Authorization: this.$auth.strategy.token.get(),
      }
    },
    server() {
      return {
        url: 'http://localhost:1337/files/',
        process: {
          headers: this.headers,
        },
      }
    },
  },
  methods: {
    async deleteImg(img) {
      await this.$axios
        .delete('files/' + img.public_id)
        .then(() => {
          this.$fetch()
        })
        .catch((err) => {
          this.$utils.consoleError(err)
        })
    },
    async getNextImages() {
      this.skip = this.skip + 10
      await this.$fetch()
    },
    async getPrevImages() {
      if (this.skip === 0) {
        return
      }
      this.skip = this.skip - 10
      await this.$fetch()
    },
    handleFilePondInit: function () {
      this.$utils.consoleLog('FilePond has initialized')

      // FilePond instance methods are available on `this.$refs.pond`
    },
    handleMediaChange() {
      this.fileToUpload = this.$refs.pond.getFile()
      // console.log(this.$refs.pond.getFile())
      this.$utils.consoleLog('files', this.fileToUpload)
    },
  },
}
</script>

<style lang="scss" scoped>
.popup-media {
  &--header {
  }
  &--images {
    display: flex;
    gap: $rad;
    flex-wrap: wrap;
    &_single {
      max-width: 125px;
      border-radius: $rad;
      position: relative;
      transition: $trans;
      img {
        border-radius: $rad;
      }
      //max-height: 200px;
      &:after {
        transition: $trans;
        content: '';
        display: block;

        position: absolute;
        top: $rad;
        right: $rad;
        outline: 2px solid $brand-yellow;
        border-radius: 50%;
        width: 15px;
        height: 15px;
        z-index: inherit;
      }
      &.selected {
        img {
          outline: 2px solid $brand-yellow;
        }

        &:after {
          color: white;
          outline-color: $brand-orange;
          background-color: $brand-yellow;
        }
      }
    }
  }
}
</style>
