<template>
  <div class="create app-inner">
    <form class="create--form" @submit.prevent="">
      <div class="create--form_field">
        <h5>Titre de ton article :</h5>
        <textarea
          v-model="articleData.title"
          :disabled="loading"
          placeholder="Le titre de ton article"
          class="w-full"
        />
        <p v-if="error.title" class="error">
          {{ errorMessages.title[error.title] }}
        </p>
      </div>
      <div class="create--form_field">
        <button
          v-if="!thumbnailPreview"
          class="btn"
          @click="
            thumbnailMode = true
            popupOpen = true
          "
        >
          Ajoute une image de couverture à ton article !
        </button>
        <div
          v-else
          :style="{ backgroundImage: 'url(' + thumbnailPreview.url + ')' }"
          class="thumb-preview"
        >
          <button class="close" @click="removeThumbnail">
            <font-awesome-icon icon="fa-xmark" />
          </button>
        </div>
        <p v-if="error.thumbnail" class="error">
          {{ errorMessages.thumbnail[error.thumbnail] }}
        </p>
      </div>
      <div class="create--form_field">
        <h5>Contenu de ton article :</h5>
        <EditorWysiwyg
          ref="editor"
          :loading="loading"
          :class="{ error: charsLeft && charsLeft.tooLong }"
          @updateContent="updateContent"
        />
        <div>
          <button class="btn" @click="popupOpen = true">
            Ajouter une image
          </button>
        </div>
        <div v-if="charsLeft" :class="{ error: charsLeft.tooLong }">
          {{ charsLeft.text }}
        </div>
        <p v-if="error.content" class="error">
          {{ errorMessages.content[error.content] }}
        </p>
      </div>
      <div class="create--form_field">
        <h5>Estimation du temps requis pour suivre le tuto :</h5>
        <input
          v-model="articleData.time_required[0]"
          :disabled="loading"
          type="number"
          min="0"
          max="48"
          required
        />
        <label>heures</label>
        <input
          v-model="articleData.time_required[1]"
          :disabled="loading"
          type="number"
          min="0"
          max="59"
          step="5"
          required
        />
        <label>minutes</label>
      </div>
      <div class="create--form_field">
        <input
          v-model="tagsString"
          :disabled="loading"
          type="text"
          placeholder="Tags séparés par une virgule"
          @keydown="checkTagsLastChar"
        />
        <div v-if="articleData.tags.length > 0" class="create--form--tags-list">
          <h5>Entre des tags pour ton article :</h5>
          <span
            v-for="tag in articleData.tags"
            :key="tag"
            class="create--form--tags-list_tag category-name small"
            @click="removeTag(tag)"
            >{{ tag }} <span class="cross">🞤</span></span
          >
        </div>
        <p v-if="error.tags" class="error">
          {{ errorMessages.tags[error.tags] }}
        </p>
      </div>
      <div class="create--form_field">
        <h5>Catégorie :</h5>
        <div>
          <span
            v-for="category in parentCategories"
            :key="category._id"
            class="category-name"
            :class="{ selected: articleData.categories[0] === category._id }"
            @click="setCat(category)"
            >{{ category.name }}</span
          >
        </div>
        <h5 v-if="childCategories.length > 0">Sous-catégorie :</h5>
        <div v-if="childCategories.length > 0">
          <span
            v-for="category in childCategories"
            :key="category._id"
            class="category-name"
            :class="{ selected: articleData.categories[1] === category._id }"
            @click="setSubCat(category)"
            >{{ category.name }}</span
          >
        </div>
        <p v-if="error.category" class="error">
          {{ errorMessages.category[error.category] }}
        </p>
      </div>

      <input
        type="submit"
        value="submit"
        class="btn"
        :disabled="charsLeft && charsLeft.tooLong"
        @click="charsLeft && charsLeft.tooLong ? null : checkArticle()"
      />
    </form>
    <PopupMedia
      v-if="popupOpen"
      category="articles"
      @selectImg="addImg"
      @close="
        popupOpen = false
        thumbnailMode = false
        $utils.consoleLog('close')
      "
    />
    <PopupLoading v-if="loading" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import PopupLoading from '../components/Popup/Loading.vue'

export default {
  name: 'Creer',
  components: { PopupLoading },
  data() {
    return {
      thumbnailMode: false,
      thumbnailPreview: null,
      popupOpen: false,
      maxCharacters: {
        title: 300,
        tags: 30,
        content: 10000,
      },
      loading: false,
      errorMessages: {
        title: {
          tooShort: 'Trop court ! entre au moins 12 caractères.',
          tooLong: 'Trop long ! entre moins de 300 caractères.',
        },
        content: {
          tooShort: 'Trop court ! entre au moins 64 caractères.',
        },
        tags: {
          tooMany: 'Tu ne peux entrer que 12 tags au maximum.',
          tooLong: 'Trop long ! entre moins de 30 caractères.',
        },
        category: { noCat: 'Tu dois sélectionner au moins 1 catégorie.' },
        thumbnail: {
          noThumbnail: 'Tu dois sélectionner une image de couverture',
        },
      },
      articleData: {
        content: '',
        title: '',
        tags: [],
        categories: [null, null],
        time_required: [null, null],
        thumbnail: null,
      },
      tagsString: '',
      error: {
        tags: null,
        content: null,
        title: null,
        category: null,
        thumbnail: null,
        exists: null,
      },
    }
  },
  computed: {
    ...mapGetters(['getCategories', 'loggedInUser']),
    parentCategories() {
      return this.getCategories.filter((item) => !item.parent)
    },
    childCategories() {
      return this.getCategories.filter(
        (item) => item.parent && item.parent === this.articleData.categories[0]
      )
    },
    charsLeft() {
      if (process.client) {
        const tmp = document.createElement('DIV')
        tmp.innerHTML = this.articleData.content
        // return tmp.textContent || tmp.innerText || '';
        return {
          text: `${tmp.innerText.length}/${this.maxCharacters.content}`,
          contentLength: tmp.innerText.length,
          tooLong: tmp.innerText.length > this.maxCharacters.content,
        }
      }
      return null
    },
  },
  watch: {},
  mounted() {
    if (!this.loggedInUser.confirmed) {
      this.setConfPopupOpen(true)
    }
    if (this.loggedInUser.role !== 'user') {
      this.maxCharacters.content = 16000
    }
  },
  methods: {
    ...mapActions({
      addSelectedImg: 'addImg',
      setConfPopupOpen: 'setConfPopupOpen',
    }),
    addImg(img) {
      if (this.thumbnailMode) {
        this.addThumbnail(img)
        return
      }
      const imgTag = '<img src="' + img.url + '" alt="">'
      console.log(imgTag)
      this.addSelectedImg(imgTag)

      this.popupOpen = false
    },
    addThumbnail(img) {
      this.$utils.consoleLog('thumb, ', img)
      this.thumbnailPreview = img
      this.articleData.thumbnail = img._id
      this.popupOpen = false
      this.thumbnailMode = false
    },
    removeThumbnail() {
      this.thumbnailPreview = null
      this.articleData.thumbnail = null
    },
    setCat(category) {
      this.$set(this.articleData.categories, 0, category._id)
      this.$set(this.articleData.categories, 1, null)
    },
    setSubCat(category) {
      this.$set(this.articleData.categories, 1, category._id)
    },
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
      this.error.tags = null
      const tag = this.tagsString.split(',')[0].trim().toLowerCase()
      if (tag.length > this.maxCharacters.tags) {
        this.error.tags = 'tooLong'
        return
      }
      if (!this.articleData.tags.includes(tag) && tag.length > 0) {
        this.articleData.tags.push(tag)
      }
      e.preventDefault()
      this.tagsString = ''
    },
    updateContent(value) {
      this.articleData.content = value
    },
    async checkArticle() {
      this.$utils.consoleLog('check')
      this.error.content = null
      this.error.tags = null
      this.error.title = null
      this.error.category = null
      this.error.thumbnail = null
      if (this.charsLeft.tooLong) return
      if (!this.articleData.categories[0]) {
        this.error.category = 'noCat'
      }
      if (this.charsLeft.contentLength < 64) {
        this.error.content = 'tooShort'
      }
      if (this.articleData.title.length > this.maxCharacters.title) {
        this.error.title = 'tooLong'
      } else if (this.articleData.title.length < 12) {
        this.error.title = 'tooShort'
      }
      if (this.articleData.tags.length > 12) {
        this.error.tags = 'tooLong'
      }
      if (!this.articleData.thumbnail) {
        this.error.thumbnail = 'noThumbnail'
      }
      await this.$axios
        .post('articles/findByContent', { article: this.articleData })
        .then((data) => {
          if (data.data !== 'ok' && data.data > 16) {
            this.error.exists = 'exists'
          }
          for (const value of Object.values(this.error)) {
            if (value !== null) return
          }
          this.sendArticle()
        })
    },
    async sendArticle() {
      this.$utils.consoleLog('send')
      this.loading = true
      try {
        const data = await this.$axios.post(
          '/articles/create',
          this.articleData
        )
        console.log(data)
        await this.$router.push('/tuto/' + data.data._id)
      } catch (e) {
        this.$utils.consoleLog('error uploading : ', e)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.create {
  &--form {
    .wysiwyg.error {
      border: 1px $error-color solid;
    }
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
    &_field {
      .thumb-preview {
        height: 250px;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        max-width: 300px;
        border-radius: $rad;
        position: relative;
        .close {
          position: absolute;
          top: $pad-min;
          right: $pad-min;
          background-color: $brand-yellow;
          border: 1px solid $brand-orange;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          > svg {
            margin: auto;
          }
        }
      }
    }
  }
}
</style>
