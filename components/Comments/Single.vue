<template>
  <div class="comment-single">
    <div class="comment-single--inner">
      <nuxt-link
        class="comment-single--inner_avatar"
        :to="'/user/' + comment.author.slug"
      >
        <UserAvatar :avatar="comment.author.avatar" />
      </nuxt-link>
      <div class="comment-single--inner--info">
        <p class="comment-single--inner--info_content">{{ comment.content }}</p>
        <p class="comment-single--inner--info_date small">
          {{ new Date(comment.created_at).toLocaleDateString('fr') }}
          {{ new Date(comment.created_at).toLocaleTimeString('fr') }}
        </p>
        <button
          v-if="loggedInUser._id === comment.author._id || isMod"
          class="comment-single--inner_avatar category-name link-style"
          @click="popupOpen = true"
        >
          Supprimer
        </button>
      </div>
    </div>
    <hr class="grey" />
    <popup-delete
      v-if="popupOpen"
      :loading="loading"
      @close="popupOpen = false"
      @delete="deleteComment"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserAvatar from '../User/Avatar.vue'
import PopupDelete from '../Popup/Delete.vue'

export default {
  name: 'CommentSingle',
  components: { PopupDelete, UserAvatar },
  props: {
    comment: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      popupOpen: false,
      loading: false,
    }
  },
  computed: {
    ...mapGetters(['loggedInUser', 'isAuthenticated', 'isMod']),
  },
  methods: {
    async deleteComment() {
      this.loading = true
      await this.$axios
        .delete('comments/' + this.comment._id)
        .then((data) => {
          this.$utils.consoleLog(data)
          this.popupOpen = false
          this.$emit('deletedComment', this.comment._id)
        })
        .catch((e) => {
          this.$utils.consoleError(e)
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.comment-single {
  &--inner {
    display: flex;
    //align-items: center;
    gap: $rad;
    &--info {
      &_content {
      }
      &_date {
        font-size: 12px;
        color: $brand-grey;
      }
    }
  }
}
</style>
