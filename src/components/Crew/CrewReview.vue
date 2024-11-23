<template>
  <div>
    <!-- 모달 -->
    <div v-if="isModalOpen" class="fixed top-4 left-4 bg-white shadow-lg rounded-lg overflow-hidden w-[400px] z-50">
      <!-- 닫기 버튼 -->
      <div class="flex justify-end p-2">
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">✕</button>
      </div>

      <!-- 리뷰 리스트 -->
      <div v-for="review in reviews" :key="review.reviewId" class="flex p-4 border-b">
        <!-- 이미지 영역 -->
        <div class="w-1/3">
          <img
            :src="review.imageUrls?.[0] || '/placeholder.jpg'"
            alt="리뷰 이미지"
            class="w-full h-24 object-cover rounded"
          />
        </div>
        <!-- 텍스트 정보 -->
        <div class="w-2/3 pl-4">
          <p class="text-sm font-medium mb-1">{{ review.content }}</p>
          <p class="text-sm text-gray-500">⭐ {{ review.point }}</p>
          <p class="text-sm text-gray-600">{{ review.title }}</p>
        </div>
      </div>
    </div>

    <!-- 모달 외 영역 -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black opacity-0 pointer-events-none"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue'
import type { Review } from '@/types/Review'

export default defineComponent({
  props: {
    reviews: {
      type: Array as PropType<Review[]>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const isModalOpen = ref(true)

    return {
      isModalOpen,
    }
  },
})
</script>

<style scoped>
/* 기본 스타일 추가 */
</style>
