<template>
  <component :is="'PopupBase'" class="popup-media">
    <div class="close" @click="$emit('close')">
      <font-awesome-icon icon="fa-xmark" size="xl" />
    </div>
    <div v-if="!uploadMode">
      <div class="popup-media--header">
        <h4>Tous tes fichiers :</h4>
        <button class="btn small" @click="uploadMode = true">
          Ajouter des fichiers
        </button>
      </div>
      <hr />
      <div v-if="$fetchState.pending">
        <SpinnerLoader />
      </div>
      <div v-else class="popup-media--images">
        <div
          v-for="img in images"
          :key="img.url"
          class="popup-media--images_single"
          :class="{ selected: selectedImage === img }"
        >
          <img :src="img.url" alt="" @click="selectedImage = img" />
        </div>
        <div v-if="images.length === 0">
          <p>Aucune image pour le moment, n'hésite pas à en ajouter !</p>
        </div>
      </div>
      <div v-if="!$fetchState.pending" class="popup-media--pagination">
        <button :disabled="skip === 0" class="btn small" @click="getPrevImages">
          Précédentes
        </button>
        <button
          :disabled="images.length < 10"
          class="btn small"
          @click="getNextImages"
        >
          Suivantes
        </button>
      </div>
      <div class="popup-media--validate">
        <button
          :disabled="selectedImage == null"
          class="btn"
          @click="
            $utils.consoleLog('emit', selectedImage)
            $emit('selectImg', selectedImage)
          "
        >
          Valider
        </button>
        <button
          :disabled="selectedImage == null"
          class="btn red"
          @click="deleting.popup = true"
        >
          Supprimer
        </button>
      </div>
      <PopupDelete
        v-if="deleting.popup"
        :loading="deleting.loading"
        @close="
          deleting.popup = false
          deleting.loading = false
        "
        @delete="deleteImg(selectedImage)"
      />
    </div>
    <div v-else>
      <p>test filepond</p>
      <client-only>
        <file-pond
          ref="pond"
          name="image"
          class="filepond"
          label-idle="Drop files here..."
          :allow-multiple="false"
          :allow-file-size-validation="true"
          :max-file-size="'4MB'"
          :allow-image-crop="true"
          :image-crop-aspect-ratio="category === 'profile' ? '1:1' : null"
          accepted-file-types="image/jpeg, image/png, image/gif"
          :server="server"
          @init="handleFilePondInit"
          @updatefiles="handleMediaChange"
          @processfile="
            $utils.consoleLog('done')
            uploadMode = false
            $fetch()
          "
        />
      </client-only>
    </div>
  </component>
</template>

<script>
import SpinnerLoader from '../SpinnerLoader.vue'
import PopupDelete from './Delete.vue'

export default {
  name: 'PopupMedia',
  components: { PopupDelete, SpinnerLoader },
  props: {
    category: {
      type: String,
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
      deleting: {
        popup: false,
        loading: false,
      },
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
      let url
      if (this.category === 'profile') {
        url = 'http://localhost:1337/files/profile'
      } else {
        url = 'http://localhost:1337/files/'
      }
      return {
        url,
        process: {
          headers: this.headers,
        },
      }
    },
  },
  methods: {
    async deleteImg(img) {
      this.deleting.loading = true
      await this.$axios
        .delete('files/' + img._id)
        .then(() => {
          this.$fetch()
          this.deleting.popup = false
        })
        .catch((err) => {
          this.$utils.consoleError(err)
        })
        .finally(() => {
          this.deleting.loading = false
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
