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
    <div v-else class="popup-media--upload">
      <h4>Mets en ligne tes images ici !</h4>
      <p>formats acceptés : PNG, JPG, GIF, taille maximale : 4MB.</p>
      <!-- Composant tiré du plugin Vue-FilePond, côté front-end  -->
      <client-only>
        <file-pond
          ref="pond"
          style="margin-top: 15px"
          name="image"
          class="filepond"
          label-idle="Choisis tes fichiers."
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
      test: {
        created_at: '2023-07-18T22:55:37.835Z',
        uploader: '64b2f7d71673e558bd5b495d',
        url: 'http://res.cloudinary.com/dxxnfnh7g/image/upload/v1689773188/upload_85db49b4fd094b55dcbf042288647b5c.jpg',
        public_id: 'upload_85db49b4fd094b55dcbf042288647b5c',
        category: 'article',
        _id: '64b7e4843fd42c319edc0fc0',
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
        url = process.env.API_URL + 'files/profile'
      } else {
        url = process.env.API_URL + 'files/'
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
      console.log(this.$refs.pond.getFile())
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
  &--pagination {
    margin-block: $pad-min;
    display: flex;
    justify-content: space-between;
  }
  &--validate {
    display: flex;
    justify-content: space-around;
  }
}
</style>
