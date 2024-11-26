<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[10]">
    <div class="bg-white w-3/4 h-5/6 p-4 rounded-lg shadow-lg flex flex-col">
      <div class="text-3xl justify-end flex cursor-pointer" @click="closeModal">x</div>
      <div class="flex flex-col items-center mb-6 mt-3">
        <img :src="place.firstImage1 || alterImg" alt="place" class="w-full h-48 object-cover rounded-md mb-4" />
        <div class="w-full">
          <h2 class="text-xl font-bold mt-2">{{ place.title }}</h2>
          <p class="text-sm text-gray-600 mt-1">{{ place.addr1 || '주소 정보가 없습니다.' }}</p>
        </div>
      </div>

      <div class="flex-grow overflow-hidden overflow-y-auto">
        <h3 class="text-lg font-semibold mb-4">리뷰</h3>
        <div class="flex gap-4 overflow-x-auto scrollbar-hide">
          <div
            v-for="review in reviews"
            :key="review.reviewId"
            class="flex flex-col p-4 border rounded-lg shadow-md bg-gray-50 flex-shrink-0 w-96"
          >
            <div class="flex items-center mb-4">
              <map-review-profile-vue :review="review" />
            </div>
            <img :src="review.imageUrls[0]" alt="review" class="w-full h-40 object-cover rounded-md mb-4" />
            <p class="text-sm text-gray-700 mb-1">{{ review.content }}</p>
            <div class="flex items-center">
              <span v-for="star in review.point" :key="star" class="text-yellow-400 text-lg">★</span>
              <span v-for="star in 5 - review.point" :key="star" class="text-gray-300 text-lg">★</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import axios from 'axios'
import AlterImg from '@/assets/Map/AlterImg.jpg'
import type { Review } from '@/types/Review'
import type { Member } from '@/types/Member'
import MapReviewProfileVue from './MapReviewProfile.vue'
export default defineComponent({
  components: { MapReviewProfileVue },
  props: {
    place: {
      type: Object,
      required: true,
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const closeModal = () => {
      emit('close')
    }
    const reviews = ref<Review[]>([])
    const profile = ref<Member>()
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/v1/reviews/search-by-attraction`, {
          params: {
            attractionId: props.place.attractionId,
          },
        })
        reviews.value = response.data
      } catch (error) {
        console.error('리뷰 데이터를 가져오는데 실패했습니다:', error)
      }
    }

    onMounted(() => {
      fetchReviews()
    })

    return { closeModal, reviews, alterImg: AlterImg, profile }
  },
})
</script>

<style scoped>
/* 스크롤바 숨기기 */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.fixed {
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
</style>
