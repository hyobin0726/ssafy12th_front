<template>
  <div class="w-full space-y-3 p-2">
    <div v-for="(comment, index) in comments" :key="index" class="pb-2 flex items-center justify-between">
      <CommentProfile :comment="comment" />
      <More class="w-6 h-6" @click="isModalOpen = true" v-if="token" />
      <CommentModal
        :isVisible="isModalOpen"
        @close="isModalOpen = false"
        :comment="comment"
        @post-delete="fetchComment"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import axios from 'axios'
import type { PropType } from 'vue'
import type { Comment } from '@/types/Comment'
import type { Review } from '@/types/Review'
import More from '@/assets/Review/more.svg'
import CommentModal from './CommentModal.vue'
import CommentProfile from '@/components/Review/ReviewCommnetProfile.vue'
export default defineComponent({
  name: 'ReviewComment',
  components: {
    More,
    CommentModal,
    CommentProfile,
  },
  props: {
    review: {
      type: Object as PropType<Review>,
      required: true,
    },
  },
  emits: ['refreshComments'],
  setup(props) {
    const token = sessionStorage.getItem('accessToken')
    const comments = ref<Comment[]>([])
    const isModalOpen = ref(false)

    const fetchComment = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/api/v1/reviews/comments/${props.review.reviewId}`,
        )
        comments.value = response.data
        // console.log('댓글 데이터를 가져왔습니다:', comments.value[0].userId)
      } catch (error) {
        console.error('댓글 데이터를 가져오는데 실패했습니다:', error)
      }
    }

    onMounted(() => {
      fetchComment()
    })

    return { comments, fetchComment, token, isModalOpen }
  },
})
</script>

<style lang="scss" scoped></style>
