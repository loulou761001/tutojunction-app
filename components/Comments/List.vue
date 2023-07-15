<template>
  <div id="comment-list" class="comment-list">
    <div v-if="isAuthenticated" class="comment-list--field">
      <h4>Laisse un commentaire sur ce guide !</h4>
      <div class="comment-list--field--info">
        <UserAvatar :avatar="loggedInUser.avatar" />
        <textarea v-model="newComment.content" placeholder="Ton commentaire" />
      </div>
      <button
        :disabled="newComment.content.length === 0"
        class="btn dark"
        @click="checkComment"
      >
        Envoyer
      </button>
      <p v-if="error.status" class="error">{{ errorMessage[error.message] }}</p>
    </div>
    <div class="comment-list--login">
      <nuxt-link to="/register"
        >Inscris ou connecte toi pour commenter !</nuxt-link
      >
    </div>

    <p v-if="comments.length === 0">Aucun commentaire pour le moment.</p>
    <CommentSingle
      v-for="comment in comments"
      :key="comment._id"
      :comment="comment"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import UserAvatar from '../User/Avatar.vue'
import CommentSingle from './Single.vue'

export default {
  name: 'CommentList',
  components: { UserAvatar, CommentSingle },
  props: {
    comments: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      newComment: { content: '' },
      errorMessage: {
        tooLong: 'Ton commentaire est trop long ! (255 caractères max)',
      },
      error: {
        status: false,
        message: null,
      },
    }
  },
  computed: {
    ...mapGetters(['loggedInUser', 'isAuthenticated']),
  },
  methods: {
    ...mapActions(['setConfPopupOpen']),
    checkComment() {
      if (!this.loggedInUser.confirmed) {
        this.setConfPopupOpen(true)
        return
      }
      this.loading = true
      this.error.message = null
      this.error.status = false
      if (this.newComment.content.length === 0) {
        this.loading = false
        return
      } else if (this.newComment.content.length > 255) {
        this.error.message = 'tooLong'
        this.error.status = true
        this.loading = false
      }
      if (!this.error.status) {
        this.newComment.author = this.loggedInUser.id
        this.newComment.article = this.$route.params.id
        this.newComment.liked_by = []
        this.$axios
          .post('/comments/', this.newComment)
          .then((data) => {
            this.$utils.consoleLog(data)
            data.data.comment.author = this.loggedInUser
            // eslint-disable-next-line vue/no-mutating-props
            this.comments.unshift(data.data.comment)
          })
          .catch((e) => {
            this.$utils.consoleError(e)
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.comment-list {
  &--login {
    display: flex;
    margin-bottom: $pad-min;
    font-weight: bold;
  }
  &--field {
    &--info {
      display: flex;
      align-items: center;
      gap: $pad-min;
      margin-bottom: $pad-min;
      textarea {
        width: 100%;
      }
    }
    h4 {
      margin-bottom: $pad-min;
    }
    margin-bottom: $pad-min;
  }
}
</style>
