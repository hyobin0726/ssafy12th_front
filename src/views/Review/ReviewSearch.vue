<template>
  <div>
    <div v-if="reviews.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6 h-screen w-screen">
      <div v-for="(review, index) in reviews" :key="index" class="rounded-lg overflow-hidden shadow-lg">
        <img :src="review.imageUrls" :alt="review.title" class="w-full h-48 object-cover" />
        <div class="p-4">
          <h3 class="font-bold text-lg mb-2">{{ review.title }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

interface Review {
  title: string
  imageUrls: string
  distance: number
  walkTime: number
}

export default defineComponent({
  name: 'ReviewSearch',
  props: {
    reviews: {
      type: Array as PropType<Review[]>,
      required: true,
    },
  },
})
</script>
