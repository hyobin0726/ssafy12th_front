<template>
  <div class="flex h-screen overflow-y-scroll justify-center p-5">
    <div class="space-y-5">
      <template v-if="reviews.length > 0">
        <ReviewItem
          v-for="review in reviews"
          :key="review.reviewId"
          :review="review"
          class="bg-white animate-slide-in"
        />
      </template>
      <p v-else class="text-center text-gray-500 flex justify-center items-center h-screen">작성된 리뷰가 없습니다.</p>
    </div>
  </div>
  <div class="bottom-5 absolute right-5 bg-green text-white py-2 px-5 rounded-lg" @click="handleCreateClick">
    글쓰기
  </div>
  <ReviewWrite :isVisible="isModalOpen" @close="isModalOpen = false" />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import axios from 'axios'
import ReviewItem from '@/components/Review/ReviewItem.vue'
import type { Review } from '@/types/Review'
import ReviewWrite from '@/components/Review/ReviewWrite.vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  components: { ReviewItem, ReviewWrite },
  setup() {
    const reviews = ref<Review[]>([])
    const router = useRouter()
    const isModalOpen = ref(false)
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/v1/reviews/list`)
        reviews.value = response.data
      } catch (error) {
        console.error('리뷰 데이터를 가져오는데 실패했습니다:', error)
      }
    }
    const handleCreateClick = () => {
      const token = sessionStorage.getItem('accessToken')
      if (!token) {
        alert('로그인 후 이용해주세요.')
        // console.error('토큰이 없습니다. 로그인 후 다시 시도하세요.')
        router.push('/login')
        return
      }
      isModalOpen.value = true
    }

    onMounted(() => {
      fetchReviews()
    })

    return { reviews, isModalOpen, handleCreateClick }
  },
})
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fadeIn 1s ease-in-out;
}

.animate-slide-in {
  animation: slideIn 0.8s ease-in-out;
}
</style>
