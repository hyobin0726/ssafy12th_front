<template>
  <ReviewNav @searchResults="handleSearchResults" />
  <div class="flex h-screen justify-center p-5">
    <div class="space-y-5">
      <template v-if="filteredReviews.length > 0">
        <ReviewItem
          v-for="review in filteredReviews"
          :key="review.reviewId"
          :review="review"
          class="bg-white animate-slide-in"
        />
      </template>
      <p v-else class="text-center text-gray-500 flex justify-center items-center h-screen">작성된 리뷰가 없습니다.</p>
    </div>
  </div>
  <div
    class="bottom-5 absolute right-6 bg-green text-white py-2 px-5 rounded-lg hover:bg-opacity-80 item"
    @click="handleCreateClick"
  >
    글쓰기
  </div>
  <ReviewWrite :isVisible="isModalOpen" @close="isModalOpen = false" />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue'
import axios from 'axios'
import ReviewItem from '@/components/Review/ReviewItem.vue'
import type { Review } from '@/types/Review'
import ReviewWrite from '@/components/Review/ReviewWrite.vue'
import { useRouter } from 'vue-router'
import ReviewNav from '@/components/Review/ReviewNav.vue'
export default defineComponent({
  components: { ReviewItem, ReviewWrite, ReviewNav },
  setup() {
    const reviews = ref<Review[]>([])
    const searchResults = ref<Review[]>([])
    const isSearching = ref(false)
    const router = useRouter()
    const isModalOpen = ref(false)
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/v1/reviews/list`)
        reviews.value = response.data
        // console.log('리뷰 데이터를 성공적으로 가져왔습니다:', reviews.value)
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
    const handleSearchResults = (results: Review[]) => {
      searchResults.value = results
      isSearching.value = true
    }

    onMounted(() => {
      fetchReviews()
    })

    const filteredReviews = ref<Review[]>([])
    watch(
      [isSearching, searchResults, reviews],
      () => {
        // console.log('검색 중:', isSearching.value)
        filteredReviews.value = isSearching.value ? searchResults.value : reviews.value
      },
      { immediate: true },
    )
    return { reviews, isModalOpen, handleCreateClick, handleSearchResults, filteredReviews }
  },
})
</script>

<style scoped>
.item:hover {
  transform: scale(1.2);
}
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
