<template>
  <section class="p-6 flex flex-col items-center border-[1px]">
    <div class="flex items-center w-full mb-4 justify-between"><ReviewProfile :review="review" /></div>

    <div class="p-2 flex justify-center mb-4 w-full" @click="isModalOpen = true">
      <ReviewImage :imageUrls="review.image_url" />
    </div>

    <div class="w-full flex mb-4 justify-between items-center">
      <ReviewLikeAndComment :review="review" />
    </div>
    <div class="w-full" @click="isModalOpen = true">
      <ReviewContents :review="review" />
    </div>
  </section>
  <ReviewDetail :review="review" :isVisible="isModalOpen" @close="isModalOpen = false" />
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
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
    const formattedDate = computed(() => {
      const date = props.review.created_at
      return (
        date.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }) +
        ' ' +
        date.toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        })
      )
    })
    const isModalOpen = ref(false)

    return { formattedDate, isModalOpen }
  },
})
</script>
