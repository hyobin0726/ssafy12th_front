<template>
  <div class="flex w-full items-center mb-4">
    <div v-if="review.title">
      <Location class="h-6 mr-2" />
      <h2 class="mr-2 text-lg font-semibold mb-1">{{ review.title }}</h2>
    </div>
    <span v-for="(star, index) in stars" :key="index" class="w-6 h-6">
      <component :is="star" />
    </span>
  </div>
  <div class="w-full mb-4">
    <p>{{ review.content }}</p>
  </div>
  <div class="w-full flex items-center space-x-2 mt-4">
    <span
      v-for="(hashTag, index) in hashTags"
      :key="index"
      class="bg-[#A8B087] text-white px-4 py-2 rounded-md text-sm font-medium shadow-md hover:bg-[#8c9d74] transition-colors duration-300"
    >
      #{{ hashTag }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue'
import axios from 'axios'
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
    const hashTags = ref<string[]>([])
    const fetchHashTags = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/api/v1/reviews/hashtag/${props.review.reviewId}`,
        )
        hashTags.value = response.data
        console.log('해시태그 데이터를 가져왔습니다:', hashTags.value)
      } catch (error) {
        console.error('해시태그 데이터를 가져오는데 실패했습니다:', error)
      }
    }
    onMounted(() => {
      fetchHashTags()
    })

    return { stars, hashTags, fetchHashTags }
  },
})
</script>

<style lang="scss" scoped></style>
