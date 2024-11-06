<template>
  <div class="flex w-full items-center mb-4">
    <Location class="h-6 mr-2" />
    <h2 class="mr-2 text-lg font-semibold mb-1">{{ review.title }}</h2>
    <span v-for="(star, index) in stars" :key="index" class="w-6 h-6">
      <component :is="star" />
    </span>
  </div>
  <div class="w-full mb-4">
    <p>{{ review.content }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import type { PropType } from 'vue'
import type { Review } from '@/types/Review'
import Location from '@/assets/Review/Location.svg'
import FullStar from '@/assets/Review/FullStar.svg'
import EmptyStar from '@/assets/Review/EmptyStar.svg'
import HalfStar from '@/assets/Review/HalfStar.svg'
export default defineComponent({
  components: { Location, FullStar, EmptyStar, HalfStar },
  props: {
    review: {
      type: Object as PropType<Review>,
      required: true,
    },
  },
  setup(props) {
    const stars = computed(() => {
      const fullStars = Math.floor(props.review.point) // 꽉 찬 별 개수
      const hasHalfStar = props.review.point % 1 >= 0.5 // 반 별 여부
      const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0) // 빈 별 개수

      return [
        ...Array(fullStars).fill('FullStar'),
        ...(hasHalfStar ? ['HalfStar'] : []),
        ...Array(emptyStars).fill('EmptyStar'),
      ]
    })

    return { stars }
  },
})
</script>

<style lang="scss" scoped></style>
