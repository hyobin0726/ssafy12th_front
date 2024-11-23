<template>
  <div v-if="reviews.length" class="fixed top-20 left-16 bg-white shadow-md border rounded-lg w-80 z-50 p-4">
    <h2 class="text-xl font-bold mb-2">모임 리뷰</h2>
    <div v-for="(review, index) in reviews" :key="index" class="mb-4">
      <h3 class="text-lg font-semibold text-gray-800">{{ review.title }}</h3>
      <p class="text-gray-600">{{ review.content }}</p>
      <p class="text-sm text-gray-400">작성자: {{ review.author }}</p>
    </div>
  </div>
  <p v-else class="text-gray-500">해당 지역에 등록된 리뷰가 없습니다.</p>
</template>

<script lang="ts">
import { defineComponent, ref, watch, PropType } from 'vue'
import axios from 'axios'

export default defineComponent({
  name: 'CrewReview',
  props: {
    sidoCode: {
      type: String,
      required: true,
    },
    gugunCode: {
      type: String as PropType<string | null>,
      default: null,
    },
  },
  setup(props) {
    const reviews = ref<{ title: string; content: string; author: string }[]>([])

    const fetchReviews = async () => {
      try {
        const params: any = { sidoCode: props.sidoCode }
        if (props.gugunCode) {
          params.gugunCode = props.gugunCode
        }
        const response = await axios.get('/api/crew/reviews', { params })
        reviews.value = response.data
      } catch (error) {
        console.error('리뷰를 가져오는 중 오류 발생:', error)
        reviews.value = []
      }
    }

    // Props가 변경될 때 리뷰 데이터 다시 로드
    watch(() => [props.sidoCode, props.gugunCode], fetchReviews, { immediate: true })

    return {
      reviews,
    }
  },
})
</script>

<style scoped>
/* Tailwind 스타일 활용 */
</style>
