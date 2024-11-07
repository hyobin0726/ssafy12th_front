<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="flex h-screen">
      <Nav class="w-1/4 h-screen" />
      <div class="w-3/4 overflow-y-scroll">
        <!-- 프로필 상단 -->
        <div class="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
          <div class="flex items-center space-x-4">
            <!-- <img :src="userData.profileImage" alt="profile picture" class="w-24 h-24 rounded-full object-cover" /> -->
            <!-- 프로필 이미지에 SVG 컴포넌트 사용 -->
            <Logo class="w-24 h-24 rounded-full object-cover" />
            <div>
              <h2 class="text-2xl font-semibold">{{ userData.name }}</h2>
              <p class="text-gray-500">{{ userData.username }}</p>
              <p class="text-gray-700">{{ userData.bio }}</p>
            </div>
          </div>

          <!-- 프로필 하단 버튼 -->
          <div class="flex mt-4 space-x-3">
            <button @click="shareProfile" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              URL 공유
            </button>
            <button @click="editProfile" class="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400">
              프로필 수정
            </button>
            <!-- <button @click="deleteAccount" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              회원 탈퇴
            </button> -->
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
        </div>

        <!-- 리뷰 목록 -->
        <div v-if="selectedTab === 'reviews'" class="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div v-for="review in userReviews" :key="review.id" class="bg-white p-4 rounded-lg shadow-md">
            <!-- <img :src="review.image" alt="Review Image" class="w-full h-40 object-cover rounded-md mb-2" /> -->
            <Logo alt="Review Image" class="w-full h-40 object-cover rounded-md mb-2" />
            <p class="text-gray-800 font-semibold">{{ review.title }}</p>
            <p class="text-gray-600 text-sm mt-1">{{ review.date }}</p>
          </div>
        </div>

        <!-- 저장된 리뷰 목록 -->
        <div v-if="selectedTab === 'saved'" class="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div v-for="saved in savedReviews" :key="saved.id" class="bg-white p-4 rounded-lg shadow-md">
            <!-- <img :src="saved.image" alt="Saved Review Image" class="w-full h-40 object-cover rounded-md mb-2" /> -->
            <Logo alt="Saved Image" class="w-full h-40 object-cover rounded-md mb-2" />
            <p class="text-gray-800 font-semibold">{{ saved.title }}</p>
            <p class="text-gray-600 text-sm mt-1">{{ saved.date }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Logo from '@/assets/logo.svg'
import Nav from '@/components/common/Nav.vue'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  components: { Logo, Nav },
  name: 'MyPage',
  setup() {
    // 더미 데이터
    const userData = ref({
      profileImage: 'https://via.placeholder.com/150',
      name: '허준수',
      username: 'junsu515',
      bio: '당나기당나기당당나기.',
    })

    const userReviews = ref([
      { id: 1, title: '리뷰 1', date: '2023-09-01', image: 'https://via.placeholder.com/150' },
      { id: 2, title: '리뷰 2', date: '2023-09-10', image: 'https://via.placeholder.com/150' },
      { id: 3, title: '리뷰 3', date: '2023-09-15', image: 'https://via.placeholder.com/150' },
      { id: 4, title: '리뷰 4', date: '2023-09-19', image: 'https://via.placeholder.com/150' },
    ])

    const savedReviews = ref([
      { id: 4, title: '저장된 리뷰 1', date: '2023-08-20', image: 'https://via.placeholder.com/150' },
      { id: 5, title: '저장된 리뷰 2', date: '2023-08-25', image: 'https://via.placeholder.com/150' },
      { id: 6, title: '저장된 리뷰 3', date: '2023-09-05', image: 'https://via.placeholder.com/150' },
    ])

    const selectedTab = ref('reviews')

    // 함수
    const shareProfile = () => {
      alert('URL이 클립보드에 복사되었습니다.')
    }

    const editProfile = () => {
      alert('프로필 수정 페이지로 이동합니다.')
    }

    const deleteAccount = () => {
      alert('정말로 회원 탈퇴하시겠습니까?')
    }

    return {
      userData,
      userReviews,
      savedReviews,
      selectedTab,
      shareProfile,
      editProfile,
      deleteAccount,
    }
  },
})
</script>

<style scoped>
/* Tailwind CSS로 스타일을 적용하므로 추가 스타일은 필요하지 않음 */
</style>
