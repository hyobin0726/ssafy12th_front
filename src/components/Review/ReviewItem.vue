<template>
  <section class="p-6 flex flex-col items-center border-[1px]">
    <div class="flex items-center w-full mb-4 justify-between">
      <ReviewProfile :review="review" />
    </div>
    <div class="p-2 flex justify-center mb-4 w-full" @click="isModalOpen = true">
      <ReviewImage :imageUrls="review.imageUrls" />
    </div>

    <div class="w-full flex mb-4 justify-between items-center">
      <ReviewLikeAndComment :review="review" />
    </div>
    <div class="w-full" @click="isModalOpen = true">
      <ReviewContents :review="review" />
    </div>
    <ReviewDetail :review="review" :isVisible="isModalOpen" @close="isModalOpen = false" />
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

import type { PropType } from 'vue'
import type { Review } from '@/types/Review'
import ReviewImage from '@/components/Review/ReviewImage.vue'
import ReviewProfile from './ReviewProfile.vue'
import ReviewLikeAndComment from './ReviewLikeAndComment.vue'
import ReviewContents from './ReviewContents.vue'
import ReviewDetail from './ReviewDetail.vue'
export default defineComponent({
  components: { ReviewImage, ReviewProfile, ReviewLikeAndComment, ReviewContents, ReviewDetail },
  props: {
    review: {
      type: Object as PropType<Review>,
      required: true,
    },
  },
  setup(props) {
    const isModalOpen = ref(false)

    return { isModalOpen }
  },
})
</script>

<style scoped>
.item {
  box-shadow: -2px 2px 10px rgba(0, 0, 0, 0.2);
  /* transition: transform 0.3s ease-in-out; */
  /* cursor: pointer; */
  /* counter-increment: item-counter; */
}
.item:hover {
  transform: scale(1.07);
}
</style>
