<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="flex h-screen">
      <div class="w-3/4 overflow-y-scroll">
        <!-- 프로필 상단 -->
        <div class="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
          <div class="flex items-center space-x-4">
            <img :src="userMyData?.profileUrl" alt="profile picture" class="w-24 h-24 rounded-full object-cover" />
            <div>
              <h2 class="text-2xl font-semibold">{{ userMyData?.name }}</h2>
            </div>
          </div>

          <!-- 프로필 하단 버튼 -->
          <div class="flex mt-4 space-x-3">
            <button @click="shareProfile" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              URL 공유
            </button>
          </div>
        </div>

        <!-- 탭 메뉴 -->
        <div class="flex justify-center space-x-4 mt-6 mb-4 text-lg font-semibold text-gray-600">
          <button
            @click="selectedTab = 'reviews'"
            :class="{ 'text-blue-500 border-b-2 border-blue-500': selectedTab === 'reviews' }"
          >
            작성한 리뷰
          </button>
          <button
            @click="selectedTab = 'saved'"
            :class="{ 'text-blue-500 border-b-2 border-blue-500': selectedTab === 'saved' }"
          >
            저장된 리뷰
          </button>
          <button
            @click="selectedTab = 'markers'"
            :class="{ 'text-blue-500 border-b-2 border-blue-500': selectedTab === 'markers' }"
          >
            저장된 마커
          </button>
        </div>

        <!-- 리뷰 목록 -->
        <div v-if="selectedTab === 'reviews'" class="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div v-for="review in userReviews" :key="review.reviewId" class="bg-white p-4 rounded-lg shadow-md">
            <img :src="review.imageUrls[0]" alt="Review Image" class="w-full h-40 object-cover rounded-md mb-2" />
            <p class="text-gray-800 font-semibold">{{ review.title }}</p>
            <p class="text-gray-600 text-sm mt-1">{{ review.createdAt }}</p>
          </div>
        </div>

        <!-- 저장된 리뷰(북마크) 목록 -->
        <div v-if="selectedTab === 'saved'" class="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div v-for="saved in savedReviews" :key="saved.reviewId" class="bg-white p-4 rounded-lg shadow-md">
            <img :src="saved.imageUrls[0]" alt="Saved Review Image" class="w-full h-40 object-cover rounded-md mb-2" />
            <p class="text-gray-800 font-semibold">{{ saved.title }}</p>
            <p class="text-gray-600 text-sm mt-1">{{ saved.createdAt }}</p>
          </div>
        </div>

        <!-- 마커 목록 -->
        <div v-if="selectedTab === 'markers'" class="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div v-for="review in userMarkers" :key="review.id" class="bg-white p-4 rounded-lg shadow-md">
            <Logo alt="Review Image" class="w-full h-40 object-cover rounded-md mb-2" />
            <p class="text-gray-800 font-semibold">{{ review.title }}</p>
            <p class="text-gray-600 text-sm mt-1">{{ review.date }}</p>
          </div>
        </div>
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

export default defineComponent({
  components: { Logo },
  name: 'MyPage',
  setup() {
    const userMyData = ref<Member>()
    const userReviews = ref<Review[]>([])
    const savedReviews = ref<Review[]>([])
    const userMarkers = ref([
      { id: 4, title: '마커', date: '2023-08-20' },
      { id: 5, title: '마커2', date: '2023-08-25' },
    ])
    const selectedTab = ref('reviews')

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

    onMounted(() => {
      fetchMyPageData() //마이페이지 자기자신 데이터 로드
      fetchUserReviews() //리뷰 데이터 로드
      fetchSavedReviews() // 북마크 데이터 로드
    })

    const shareProfile = () => {
      alert('URL이 클립보드에 복사되었습니다.')
    }

    return {
      userMyData,
      userReviews,
      savedReviews,
      userMarkers,
      selectedTab,
      shareProfile,
    }
  },
})
</script>

<style scoped>
/* Tailwind CSS로 스타일을 적용하므로 추가 스타일은 필요하지 않음 */
</style>
