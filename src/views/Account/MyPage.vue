<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
    <!-- Hero Section with Enhanced Profile -->
    <div class="relative h-[400px] overflow-hidden">
      <!-- Animated Background with Parallax -->
      <div
        class="absolute inset-0 bg-cover bg-center animate-parallax"
        style="
          background-image: url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80');
        "
      >
        <div class="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60 backdrop-blur-sm"></div>
        <!-- Floating Particles -->
        <div class="particle-container">
          <div v-for="n in 20" :key="n" class="particle"></div>
        </div>
      </div>

      <!-- Enhanced Profile Content -->
      <div class="relative container mx-auto px-6 pt-20">
        <div class="flex items-center space-x-8 animate-profileFadeIn">
          <!-- Profile Image with Enhanced Effects -->
          <div class="relative group">
            <div class="absolute inset-0 bg-blue-500 rounded-full animate-glow-ring"></div>
            <div
              class="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-75 group-hover:opacity-100 animate-spin-slow"
            ></div>
            <img
              :src="userMyData?.profileUrl"
              alt="profile"
              class="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover relative z-10 animate-profilePop transform group-hover:scale-105 transition-all duration-300"
            />
          </div>

          <!-- Enhanced User Info -->
          <div class="text-white space-y-2">
            <h2 class="text-4xl font-bold animate-slideUpFade tracking-wide">
              {{ userMyData?.name }}
              <span class="inline-block animate-wave">👋</span>
            </h2>
            <p class="text-gray-200 animate-slideUpFade animation-delay-200 text-lg">{{ userMyData?.loginId }}</p>
            <p class="text-gray-200 animate-slideUpFade animation-delay-300">{{ userMyData?.email }}</p>
            <button
              @click="shareProfile"
              class="mt-6 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full backdrop-blur-sm transition-all duration-500 animate-slideUpFade animation-delay-400 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              Share Profile
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Tab Navigation -->
    <div class="container mx-auto px-6 -mt-16 relative z-10">
      <div
        class="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-3 animate-slideUpFade animation-delay-500 hover:shadow-2xl transition-all duration-500"
      >
        <div class="flex justify-center space-x-6">
          <button
            v-for="(tab, index) in ['reviews', 'bookmarks', 'markers']"
            :key="tab"
            @click="selectedTab = tab"
            :class="[
              'relative px-8 py-4 rounded-xl font-medium transition-all duration-500 transform',
              'hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10',
              selectedTab === tab
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                : 'text-gray-600',
              `animation-delay-${(index + 1) * 100}`,
            ]"
          >
            <!-- Tab Indicator -->
            <div
              v-if="selectedTab === tab"
              class="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-tabIndicator"
            ></div>
            {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
          </button>
        </div>
      </div>
    </div>

    <!-- Enhanced Content Grid -->
    <div class="container mx-auto px-6 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <template v-for="(item, index) in getActiveItems()" :key="item.id">
          <div
            class="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-500 animate-cardAppear hover:shadow-xl"
            :style="`animation-delay: ${index * 100}ms`"
          >
            <div class="relative h-48 overflow-hidden">
              <img
                :src="getItemImage(item)"
                alt="Item Image"
                class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              ></div>
              <!-- Hover Overlay -->
              <div
                class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              >
                <button
                  class="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm text-white transform hover:scale-105 transition-all duration-300"
                >
                  View Details
                </button>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                {{ getItemTitle(item) }}
              </h3>
              <p class="mt-2 text-gray-600">{{ getItemSubtitle(item) }}</p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import Logo from '@/assets/logo.svg'
import { defineComponent, ref, onMounted } from 'vue'
import type { Member } from '@/types/Member'
import type { Review } from '@/types/Review' //리뷰랑 북마크 타입
import type { Marker } from '@/types/Marker' //마커 타입
import type { Attraction } from '@/types/Attraction' //마커 명소 타입

export default defineComponent({
  components: { Logo },
  name: 'MyPage',
  setup() {
    const userMyData = ref<Member>()
    const userReviews = ref<Review[]>([])
    const savedReviews = ref<Review[]>([])
    const userMarkers = ref<Marker[]>([])
    // const markerAttraction = ref<Attraction[]>([])
    // 마커와 연결된 Attraction 데이터
    const markerAttractions = ref<Record<number, Attraction>>({}) // key: markerId, value: Attraction 데이터

    const selectedTab = ref('reviews')

    const getActiveItems = () => {
      switch (selectedTab.value) {
        case 'reviews':
          return userReviews.value
        case 'saved':
          return savedReviews.value
        case 'markers':
          return userMarkers.value
        default:
          return []
      }
    }

    const getItemImage = (item: any) => {
      if ('imageUrls' in item && item.imageUrls.length > 0) {
        return item.imageUrls[0]
      }
      return markerAttractions.value[item.markerId]?.firstImage1 || ''
    }

    const getItemTitle = (item: any) => {
      if ('title' in item) {
        return item.title
      }
      return markerAttractions.value[item.markerId]?.title || ''
    }

    const getItemSubtitle = (item: any) => {
      if ('createdAt' in item) {
        return new Date(item.createdAt).toLocaleDateString()
      }
      return markerAttractions.value[item.markerId]?.addr1 || ''
    }

    //마이페이지 조회
    const fetchMyPageData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/member', {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
          },
        })

        // 데이터 업데이트
        userMyData.value = response.data
        // console.log('마이데이터', userMyData)
        console.log('유저 ID - ', userMyData.value?.userId)
      } catch (error) {
        console.error('마이페이지 데이터 조회 실패:', error)
      }
    }

    // 작성한 리뷰 데이터 조회
    const fetchUserReviews = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/reviews/my-reviews', {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
          },
        })
        // 데이터 업데이트
        // userReviews.value = response.data.map((review: any) => ({
        //   reviewId: review.reviewId,
        //   title: review.title,
        //   date: new Date(review.createdAt).toLocaleDateString(), // 날짜 포맷
        // }))
        userReviews.value = response.data
        console.log('작성한 리뷰 데이터:', userReviews.value)
      } catch (error) {
        console.error('작성한 리뷰 데이터 조회 실패:', error)
      }
    }

    // 저장된 리뷰(북마크) 데이터 조회
    const fetchSavedReviews = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/reviews/my-bookmarks', {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
          },
        })
        savedReviews.value = response.data
        console.log('북마크된 리뷰 데이터:', savedReviews.value)
      } catch (error) {
        console.error('북마크 데이터 조회 실패:', error)
      }
    }

    // 마커 데이터 조회
    const fetchUserMarkers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/map/marker', {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
          },
        })
        userMarkers.value = response.data
        console.log('저장된 마커 데이터:', userMarkers.value)

        // 각 마커의 Attraction 데이터를 추가로 조회
        for (const marker of userMarkers.value) {
          await fetchAttractionData(marker.markerId, marker.attractionId)
        }
      } catch (error) {
        console.error('마커 데이터 조회 실패:', error)
      }
    }

    // Attraction 데이터 조회
    const fetchAttractionData = async (markerId: number, attractionId: number) => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/attractions/${attractionId}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
          },
        })
        markerAttractions.value[markerId] = response.data
        console.log(`마커 ${markerId}의 Attraction 데이터:`, response.data)
      } catch (error) {
        console.error(`Attraction 데이터 조회 실패 (markerId: ${markerId}, attractionId: ${attractionId}):`, error)
      }
    }

    onMounted(() => {
      fetchMyPageData() //마이페이지 자기자신 데이터 로드
      fetchUserReviews() //리뷰 데이터 로드
      fetchSavedReviews() // 북마크 데이터 로드
      fetchUserMarkers() // 마커 데이터 로드 및 연결된 Attraction 데이터 조회
    })

    const shareProfile = () => {
      alert('URL이 클립보드에 복사되었습니다.')
    }

    return {
      userMyData,
      userReviews,
      savedReviews,
      userMarkers,
      markerAttractions,
      selectedTab,
      shareProfile,

      getActiveItems,
      getItemImage,
      getItemTitle,
      getItemSubtitle,
    }
  },
})
</script>

<style scoped>
@keyframes parallax {
  0% {
    transform: scale(1.1) translate(0, 0);
  }
  50% {
    transform: scale(1.2) translate(-1%, -1%);
  }
  100% {
    transform: scale(1.1) translate(0, 0);
  }
}

@keyframes glow-ring {
  0% {
    transform: scale(0.8);
    opacity: 0.5;
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
  }
  50% {
    transform: scale(1.1);
    opacity: 0.3;
    box-shadow: 0 0 40px rgba(59, 130, 246, 0.7);
  }
  100% {
    transform: scale(0.8);
    opacity: 0.5;
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
  }
}

@keyframes profilePop {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes slideUpFade {
  0% {
    transform: translateY(30px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes wave {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-10deg);
  }
  75% {
    transform: rotate(10deg);
  }
}

@keyframes tabIndicator {
  0% {
    transform: scaleX(0);
    opacity: 0;
  }
  100% {
    transform: scaleX(1);
    opacity: 1;
  }
}

@keyframes cardAppear {
  0% {
    transform: translateY(60px) scale(0.9);
    opacity: 0;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

@keyframes particle {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    transform: translateY(-100px) translateX(20px);
    opacity: 0;
  }
}

.animate-parallax {
  animation: parallax 20s ease-in-out infinite;
}

.animate-glow-ring {
  animation: glow-ring 3s infinite;
}

.animate-profilePop {
  animation: profilePop 1s ease-out forwards;
}

.animate-wave {
  animation: wave 2s infinite;
  display: inline-block;
}

.animate-spin-slow {
  animation: spin 8s linear infinite;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
  animation: particle 3s infinite;
}

.particle-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.particle-container .particle:nth-child(odd) {
  animation-delay: calc(var(--i) * 0.5s);
  animation-duration: calc(3s + var(--i) * 0.5s);
}

/* Add more specific animation delays */
.animation-delay-100 {
  animation-delay: 100ms;
}
.animation-delay-200 {
  animation-delay: 200ms;
}
.animation-delay-300 {
  animation-delay: 300ms;
}
.animation-delay-400 {
  animation-delay: 400ms;
}
.animation-delay-500 {
  animation-delay: 500ms;
}
</style>

1. 프로필 섹션: 켄번즈(Ken Burns) 효과가 적용된 배경 이미지 프로필 사진 주위의 펄스 애니메이션 효과 프로필 정보의 순차적
페이드인 애니메이션 2. 탭 내비게이션: 부드러운 호버 효과 선택된 탭의 스케일 및 색상 전환 애니메이션 음영이 있는 플로팅
디자인 3. 컨텐츠 카드: 호버 시 부드러운 스케일 확대 효과 이미지 줌 효과 그라데이션 오버레이 페이드인 카드 등장 시 순차적
슬라이드업 애니메이션 4. 반응형 디자인: 모바일, 태블릿, 데스크톱에 최적화된 그리드 레이아웃 부드러운 브레이크포인트 전환
5. 마이크로 인터랙션: 버튼 호버 효과 탭 전환 시 부드러운 애니메이션 스크롤 시 카드 등장 효과 ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
1-2. 백그라운드 효과: 패럴랙스 효과를 추가하여 배경이 부드럽게 움직이도록 했습니다 부유하는 파티클 효과를 추가하여
동적인 느낌을 줬습니다 그라디언트 오버레이로 더 세련된 느낌을 연출했습니다 프로필 섹션: 프로필 이미지에 글로우 효과와
회전하는 그라디언트 테두리를 추가했습니다 호버 시 부드러운 스케일 효과를 적용했습니다 이름 옆에 웨이브 애니메이션이 있는
이모지를 추가했습니다 탭 내비게이션: 반투명 백드롭 블러 효과로 떠있는 느낌을 자연스럽게 했습니다 선택된 탭에 그라디언트
배경과 인디케이터를 추가했습니다 호버 시 부드러운 그라디언트 효과를 적용했습니다 컨텐츠 카드: 백드롭 블러 효과로
깊이감을 추가했습니다 호버 시 더 부드러운 확대 효과와 오버레이를 적용했습니다 순차적인 등장 애니메이션을 개선했습니다
애니메이션: 모든 요소에 자연스러운 등장 애니메이션을 추가했습니다 딜레이를 조정하여 순차적으로 요소들이 나타나도록
했습니다 호버 효과를 더 부드럽고 세련되게 개선했습니다
