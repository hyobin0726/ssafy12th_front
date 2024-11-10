<template>
  <div class="flex h-screen">
    <Nav class="w-1/4 h-screen" />
    <div class="w-3/4 overflow-y-scroll">
      <ReviewItem v-for="review in reviews" :key="review.review_id" :review="review" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import axios from 'axios'
import ReviewItem from '@/components/Review/ReviewItem.vue'
import Nav from '@/components/common/Nav.vue'
import type { Review } from '@/types/Review'
export default defineComponent({
  components: { ReviewItem, Nav },
  setup() {
    const reviews = ref<Review[]>([])

    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/reviews/list')
        reviews.value = response.data
        console.log('리뷰 데이터를 가져왔습니다:', reviews.value)
      } catch (error) {
        console.error('리뷰 데이터를 가져오는데 실패했습니다:', error)
      }
    }

    onMounted(() => {
      fetchReviews()
    })

    return { reviews }
  },
})
</script>
