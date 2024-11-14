<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-5 rounded-lg shadow-lg w-3/4 h-5/6 flex flex-col">
      <div class="flex justify-between items-center mb-4">
        <div />
        <span class="text-xl">리뷰 자세히 보기</span>
        <div class="text-3xl mr-2" @click="closeModal">x</div>
      </div>
      <hr />
      <div class="flex h-full overflow-y-auto">
        <div class="w-1/2 p-3 flex justify-center items-center">
          <ReviewImage :imageUrls="review.imageUrls" class="" />
        </div>
        <div class="w-1/2 space-y-4 mt-3 flex flex-col">
          <div class="w-full">
            <ReviewContents :review="review" />
          </div>
          <div class="w-full flex justify-between items-center mt-3">
            <ReviewLikeAndComment :review="review" />
          </div>
          <hr />
          <div class="flex-grow overflow-y-auto">
            <ReviewComment :review="review" />
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
import type { Review } from '@/types/Review'
import ReviewImage from '@/components/Review/ReviewImage.vue'
import ReviewLikeAndComment from './ReviewLikeAndComment.vue'
import ReviewContents from './ReviewContents.vue'
import ReviewComment from './ReviewComment.vue'
import Send from '@/assets/Review/send.svg'
export default defineComponent({
  name: 'ImageUploader',
  components: {
    ReviewImage,
    ReviewLikeAndComment,
    ReviewContents,
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

    const closeModal = () => {
      emit('close')
    }

    const submitComment = () => {
      if (newComment.value.trim()) {
        console.log('댓글 등록:', newComment.value)
        newComment.value = ''
      }
    }

    return { closeModal, newComment, submitComment }
  },
})
</script>
