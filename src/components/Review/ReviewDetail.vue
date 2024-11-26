<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-5 rounded-lg shadow-lg w-3/4 h-5/6 flex flex-col">
      <div class="flex justify-between items-center mb-4">
        <div />
        <span class="text-xl">리뷰 자세히 보기</span>
        <div class="text-3xl mr-2" @click="closeModal">x</div>
      </div>
      <hr />
      <div class="flex h-full overflow-y-auto p-3">
        <div class="w-1/2 p-3 flex justify-center items-center">
          <ReviewImage :imageUrls="review.imageUrls" class="" />
        </div>
        <div class="w-1/2 space-y-4 mt-3 flex flex-col">
          <div class="flex items-center w-full justify-between">
            <ReviewProfile :review="review" />
          </div>
          <hr />
          <div class="w-full">
            <ReviewContents :review="review" />
          </div>
          <hr />
          <div class="w-full flex justify-between items-center mt-3">
            <ReviewLikeAndComment :review="review" />
          </div>
          <div class="flex-grow overflow-y-auto">
            <ReviewComment ref="reviewComment" :review="review" />
          </div>
          <div class="w-full mt-4 flex items-center space-x-3">
            <input
              v-model="newComment"
              type="text"
              placeholder="댓글을 입력하세요..."
              class="w-full border rounded p-2"
              @keyup.enter="submitComment"
            />
            <Send class="h-6 w-6" @click="submitComment" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import type { PropType } from 'vue'
import axios from 'axios'
import type { Review } from '@/types/Review'
import ReviewImage from '@/components/Review/ReviewImage.vue'
import ReviewLikeAndComment from './ReviewLikeAndComment.vue'
import ReviewContents from './ReviewContents.vue'
import ReviewComment from './ReviewComment.vue'
import ReviewProfile from './ReviewProfile.vue'
import Send from '@/assets/Review/send.svg'
import { useToast } from 'vue-toast-notification'
export default defineComponent({
  name: 'ImageUploader',
  components: {
    ReviewImage,
    ReviewLikeAndComment,
    ReviewContents,
    ReviewProfile,
    ReviewComment,
    Send,
  },
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    review: {
      type: Object as PropType<Review>,
      required: true,
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const newComment = ref('')
    const reviewComment = ref<InstanceType<typeof ReviewComment> | null>(null) // ReviewComment에 대한 ref 설정
    const toast = useToast()
    const fetchPostComment = async () => {
      try {
        const token = sessionStorage.getItem('accessToken')
        if (!token) {
          // alert('로그인 후 다시 시도하세요.')
          toast.error('로그인 후 이용해주세요.')
          return
        }
        await axios.post(
          `${import.meta.env.VITE_APP_BASE_URL}/api/v1/reviews/comments/${props.review.reviewId}`,
          { content: newComment.value },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
      } catch (error) {
        console.error('댓글 등록에 실패했습니다:', error)
      }
    }

    const closeModal = () => {
      emit('close')
    }

    const submitComment = async () => {
      if (newComment.value.trim()) {
        await fetchPostComment()
        newComment.value = ''
        reviewComment.value?.fetchComment()
      }
    }

    return { closeModal, newComment, submitComment, reviewComment }
  },
})
</script>
