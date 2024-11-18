<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white w-3/4 h-5/6 p-4 rounded-lg shadow-lg flex flex-col">
      <div class="text-3xl justify-end flex cursor-pointer" @click="closeModal">x</div>
      <div class="flex flex-col items-center mb-6 mt-3">
        <img :src="place.Image" alt="place" class="w-full h-48 object-cover rounded-md mb-4" />
        <div class="w-full">
          <h2 class="text-xl font-bold mt-2">{{ place.title }}</h2>
          <p class="text-sm text-gray-600 mt-1">{{ place.addr1 }}</p>
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
              <img :src="review.profileUrl" alt="user" class="w-10 h-10 rounded-full mr-2 object-cover" />
              <div>
                <p class="text-sm font-semibold">{{ review.name }}</p>
                <p class="text-xs text-gray-500">{{ review.createdAt }}</p>
              </div>
            </div>
            <img :src="review.imageUrls" alt="review" class="w-full h-40 object-cover rounded-md mb-4" />
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
import { defineComponent } from 'vue'
import type { Map } from '@/types/Map'

export default defineComponent({
  props: {
    place: {
      type: Object as () => Map,
      required: true,
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const closeModal = () => {
      emit('close')
    }

    // 더미 리뷰 데이터
    const reviews = [
      {
        reviewId: 1,
        name: '허준수',
        profileUrl: 'https://via.placeholder.com/40',
        createdAt: '2024-11-15',
        content: '정말 멋진 장소입니다! 꼭 방문해보세요.',
        imageUrls:
          'https://pup-review-phinf.pstatic.net/MjAyNDA3MjBfMjEy/MDAxNzIxNDQ3MzkwOTU4.L4pKyeU3XpcfV-5BtQesq9lkVJHABCSF0tyF9hIETqQg.C2lbl78L3nE3RbMyj6B7A4rVrY4v_BPGLiKzSVtdDvQg.JPEG/C8DD015B-54AB-4D75-B684-C06033F2A9F3.jpeg?type=f912_608',
        point: 5,
      },
      {
        reviewId: 2,
        name: '박효빈',
        profileUrl: 'https://via.placeholder.com/40',
        createdAt: '2024-11-12',
        content: '조금 붐비지만 분위기는 좋아요.',
        imageUrls:
          'https://ldb-phinf.pstatic.net/20240929_282/1727578621303sVw5H_JPEG/KakaoTalk_20240929_115647857.jpg',
        point: 4,
      },
    ]

    return { closeModal, reviews }
  },
})
</script>

<style scoped>
/* 스크롤바 숨기기 */
.scrollbar-hide {
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.fixed {
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
</style>
