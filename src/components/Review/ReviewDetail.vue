<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-5 rounded-lg shadow-lg w-3/4 h-5/6 flex flex-col">
      <div class="flex justify-between items-center mb-4">
        <div />
        <span class="text-xl">리뷰 자세히 보기</span>
        <div class="text-3xl mr-2" @click="closeModal">x</div>
      </div>
      <hr />
      <div class="flex h-full">
        <div class="w-1/2 p-3">
          <ReviewImage :imageUrls="review.image_url" class="" />
        </div>
        <div class="w-1/2 space-y-4 mt-3">
          <div class="w-full">
            <ReviewContents :review="review" />
          </div>
          <div class="w-full flex justify-between items-center mt-3">
            <ReviewLikeAndComment :review="review" />
          </div>
          <hr />
          <div class="w-full">
            <ReviewComment />
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
export default defineComponent({
  name: 'ImageUploader',
  components: {
    ReviewImage,
    ReviewLikeAndComment,
    ReviewContents,
    ReviewComment,
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
    const closeModal = () => {
      emit('close')
    }

    return { closeModal }
  },
})
</script>
