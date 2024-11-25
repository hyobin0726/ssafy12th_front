<template>
  <header class="top-0 w-full transition-all duration-300 p-6">
    <div class="flex items-center justify-between py-4">
      <div class="flex items-center space-x-16">
        <router-link to="/" class="flex items-center">
          <span class="text-gray-700 text-lg">Home</span>
        </router-link>
        <nav class="flex items-center space-x-16">
          <router-link to="/map" class="text-gray-700 text-lg hover:text-green"> 지도 </router-link>
          <router-link to="/crewPage" class="text-gray-700 text-lg hover:text-green"> 모임 </router-link>
          <router-link to="/chat" class="text-gray-700 text-lg hover:text-green"> 채팅 </router-link>
        </nav>
      </div>
      <div class="relative flex items-center flex-1 max-w-[750px] mr-6">
        <input
          v-model="keyword"
          @input="onKeywordChange"
          type="text"
          placeholder="여행지를 검색해보세요"
          class="h-11 w-full px-4 py-2 rounded border border-geen focus:outline-none focus:border-[#BCC199] text-sm"
        />
        <button @click="onSearchClick" class="absolute right-0 h-11 px-4 bg-green text-white text-sm rounded-r item">
          Search
        </button>
        <!-- Dropdown for search suggestions -->
        <div
          v-if="suggestions.length > 0"
          class="absolute top-full left-0 w-full bg-white border border-gray-300 shadow-lg rounded mt-1 z-50 fade-in"
        >
          <ul>
            <li
              v-for="(suggestion, index) in suggestions"
              :key="index"
              @click="onSuggestionClick(suggestion)"
              class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              <span v-html="highlight(suggestion, keyword)"></span>
            </li>
          </ul>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <!-- 버튼 렌더링: 토큰 유무에 따라 -->
        <template v-if="isLoggedIn">
          <button
            class="px-4 py-2 h-11 bg-green bg-opacity-20 text-gray-700 text-lg rounded hover:bg-opacity-80 item"
            @click="handleLogout"
          >
            로그아웃
          </button>
          <router-link
            to="/mypage"
            class="px-4 py-2 h-11 bg-green bg-opacity-20 text-gray-700 text-lg rounded hover:bg-opacity-80 item"
          >
            마이페이지
          </router-link>
        </template>
        <template v-else>
          <button
            class="px-4 py-2 h-11 bg-green bg-opacity-20 text-gray-700 text-lg rounded hover:bg-opacity-80 item"
            @click="openLoginModal"
          >
            로그인
          </button>
          <button
            class="px-4 py-2 h-11 bg-green bg-opacity-20 text-gray-700 text-lg rounded hover:bg-opacity-80 item"
            @click="openSignUpModal"
          >
            회원가입
          </button>
        </template>
      </div>
    </div>
  </header>
  <LoginModal @close="closeLoginModal" :isVisible="isLoginModalOpen" />
  <SignUp @close="closeSignUpModal" :isVisible="isSignUpModalOpen" />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import LoginModal from '@/views/Account/Login.vue'
import SignUp from '@/views/Account/SignUp.vue'
import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import debounce from 'lodash/debounce'

interface Review {
  title: string
  imageUrls: string
  distance: number
  walkTime: number
}

export default defineComponent({
  emits: ['searchResults'],
  components: {
    LoginModal,
    SignUp,
  },
  setup(_, { emit }) {
    const isLoginModalOpen = ref(false)

    const openLoginModal = () => {
      isLoginModalOpen.value = true
    }

    const closeLoginModal = () => {
      isLoginModalOpen.value = false
    }

    const isSignUpModalOpen = ref(false)

    const openSignUpModal = () => {
      isSignUpModalOpen.value = true
    }

    const closeSignUpModal = () => {
      isSignUpModalOpen.value = false
    }
    const isLoggedIn = ref(false) // 로그인 상태
    // 로그인 상태 확인
    const checkLoginStatus = () => {
      const token = sessionStorage.getItem('accessToken')
      isLoggedIn.value = !!token // 토큰이 있으면 true, 없으면 false
    }
    const token = sessionStorage.getItem('accessToken')
    const fetchLogOut = async () => {
      try {
        await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/api/v1/auth/logout`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        sessionStorage.removeItem('accessToken')
        isLoggedIn.value = false
      } catch (error) {
        console.error(error)
      }
    }

    // 로그아웃
    const handleLogout = () => {
      fetchLogOut()
      isLoggedIn.value = false // 상태 변경
      alert('로그아웃되었습니다.')
    }

    const keyword = ref('')
    const suggestions = ref<string[]>([])
    const searchResults = ref<Review[]>([])
    const onSearchClick = async () => {
      if (keyword.value.trim()) {
        try {
          const { data } = await axios.get(
            `${import.meta.env.VITE_APP_BASE_URL}/api/v1/reviews/search?hashtagName=${keyword.value}`,
          )
          searchResults.value = data
          emit('searchResults', searchResults.value)
          // console.log('검색 결과:', searchResults.value)
        } catch (error) {
          console.error('API 호출 오류:', error)
        }
      }
    }

    const { refetch } = useQuery({
      queryKey: ['searchResults', keyword],
      queryFn: () =>
        axios
          .get(`${import.meta.env.VITE_APP_BASE_URL}/api/v1/reviews/hashSearch?keyword=${keyword.value}`)
          .then((res) => {
            const data = res.data

            suggestions.value = data
            // console.log('검색 결과:', suggestions.value)
            return data
          }),
      enabled: false,
    })

    const onKeywordChange = debounce(() => {
      if (keyword.value.trim()) {
        refetch()
      } else {
        suggestions.value = []
      }
    }, 300)

    const onSuggestionClick = (suggestion: string) => {
      keyword.value = suggestion
      suggestions.value = []
    }

    // 검색어 하이라이트
    const highlight = (text: string, query: string) => {
      const regex = new RegExp(`(${query})`, 'gi')
      return text.replace(regex, '<span class="text-black font-bold">$1</span>')
    }
    onMounted(() => {
      checkLoginStatus()
    })

    return {
      isLoginModalOpen,
      openLoginModal,
      closeLoginModal,
      isSignUpModalOpen,
      openSignUpModal,
      closeSignUpModal,
      keyword,
      suggestions,
      onKeywordChange,
      onSuggestionClick,
      highlight,
      onSearchClick,
      searchResults,
      isLoggedIn,
      handleLogout,
      token,
      fetchLogOut,
    }
  },
})
</script>
<style scoped>
.item:hover {
  transform: scale(1.1);
}
/* CSS 애니메이션 정의 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes buttonPress {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(0.95);
  }
}

/* 헤더 슬라이드 효과 */
header {
  animation: fadeIn 0.6s ease-in-out;
}

/* 버튼 클릭 효과 */
button:active {
  animation: buttonPress 0.1s ease-in-out;
  transform: scale(0.95); /* 클릭 시 즉각 반응 추가 */
}
</style>
