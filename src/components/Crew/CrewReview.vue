<template>
  <div>
    <!-- 모달 -->
    <div
      v-if="isModalOpen && reviews.length > 0"
      class="fixed top-[120px] left-4 bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden w-[400px] z-50 border border-gray-100 animate-slideIn"
    >
      <!-- 헤더 영역 -->
      <div class="flex justify-between items-center p-4 bg-gradient-to-r from-olive to-beige">
        <h2 class="text-white font-bold text-lg animate-fadeIn">리뷰 모음</h2>
        <button
          @click="$emit('close')"
          class="text-white hover:rotate-90 transition-transform duration-300 w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center"
        >
          ✕
        </button>
      </div>

      <!-- 리뷰 리스트 스크롤 영역 -->
      <div class="max-h-[80vh] overflow-y-auto custom-scrollbar">
        <div
          v-for="(review, index) in reviews"
          :key="review.reviewId"
          class="p-4 hover:bg-gray-50 transition-colors duration-300 animate-fadeInUp"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div
            class="flex gap-4 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 p-3"
          >
            <!-- 이미지 영역 -->
            <div class="w-1/3 overflow-hidden rounded-lg hover:scale-105 transition-transform duration-300">
              <img
                :src="review.imageUrls?.[0] || '/placeholder.jpg'"
                alt="리뷰 이미지"
                class="w-full h-32 object-cover hover:opacity-90 transition-opacity duration-300"
              />
            </div>

            <!-- 텍스트 정보 -->
            <div class="w-2/3 flex flex-col justify-between">
              <!-- 리뷰 내용 -->
              <p class="text-sm font-medium mb-2 line-clamp-2 hover:line-clamp-none transition-all duration-300">
                {{ review.content }}
              </p>

              <!-- 별점 & 장소명 -->
              <span class="text-sm text-gray-600">{{ review.title }}</span>

              <div class="flex items-center gap-2 mb-2">
                <div class="flex text-yellow-400">
                  <span
                    v-for="n in review.point"
                    :key="n"
                    class="animate-starPulse"
                    :style="{ animationDelay: `${n * 0.1}s` }"
                  >
                    ⭐
                  </span>
                </div>
              </div>

              <!-- 해시태그 -->
              <div class="flex flex-wrap gap-1 mb-2">
                <span
                  v-for="tag in review.hashtags"
                  :key="tag"
                  class="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:scale-105 transition-transform duration-300"
                >
                  #{{ tag }}
                </span>
              </div>

              <!-- 공개 범위 -->
              <div class="text-xs text-gray-500 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fill-rule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>모임 위치 : {{ selectedRegion?.sidoKorNm }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 배경 오버레이 -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm animate-fadeIn"
      @click="$emit('close')"
    ></div>
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
    selectedRegion: {
      type: Object as PropType<{
        sidoCode: string
        sidoEngNm: string
        sidoKorNm: string
      } | null>,
      required: true,
    },

    selectedRegionSigungu: {
      type: Object as PropType<{
        sidoCode: string
        gugunCode: string
        sigunguEngNm: string
        sigunguKorNm: string
      } | null>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const isModalOpen = ref(true)
    // const crewName = ref(props.selectedRegion?.sidoKorNm || '')
    // console.log(props.sigoName)
    return {
      isModalOpen,
      // crewName,
    }
  },
})
</script>

<style scoped>
@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes starPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.animate-slideIn {
  animation: slideIn 0.5s ease-out forwards;
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}

.animate-fadeInUp {
  animation: fadeInUp 0.5s ease-out forwards;
}

.animate-starPulse {
  animation: starPulse 1s ease-in-out infinite;
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(155, 155, 155, 0.5) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(155, 155, 155, 0.5);
  border-radius: 20px;
  border: transparent;
}
</style>

디자인 개선: 그라데이션 헤더 추가 카드 형태의 리뷰 디자인 커스텀 스크롤바 반투명 백드롭 효과 애니메이션: 모달 슬라이드인
효과 리뷰 카드 페이드인 효과 (순차적) 별점 펄스 애니메이션 이미지 호버 효과 해시태그 호버 효과 인터랙션: 닫기 버튼 회전
효과 카드 호버시 그림자 효과 이미지 호버시 확대 효과 리뷰 내용 호버시 전체 표시 스타일링: 모던한 그라데이션 효과
부드러운 트랜지션 깔끔한 타이포그래피 반응형 레이아웃
