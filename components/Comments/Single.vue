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
        </p>
      </div>
    </div>
    <hr class="grey" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserAvatar from '../User/Avatar.vue'

export default {
  name: 'CommentSingle',
  components: { UserAvatar },
  props: {
    comment: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters(['loggedInUser', 'isAuthenticated']),
  },
}
</script>

<style lang="scss" scoped>
.comment-single {
  &--inner {
    display: flex;
    align-items: center;
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
