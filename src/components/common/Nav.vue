<template>
  <div class="relative">
    <header class="absolute top-0 w-full z-50 transition-all duration-300 p-6">
      <div class="flex items-center justify-between py-4">
        <div class="flex items-center space-x-16">
          <router-link to="/" class="flex items-center">
            <!-- 임시 로고 -->
            <span class="text-white text-lg">Home</span>
          </router-link>
          <nav class="flex items-center space-x-16">
            <router-link to="/map" class="text-white text-lg font-medium hover:text-green"> 지도 </router-link>
            <router-link to="/crewPage" class="text-white text-lg font-medium hover:text-green"> 모임 </router-link>
            <router-link to="/chat" class="text-white text-lg font-medium hover:text-green"> 채팅 </router-link>
            <router-link to="/reviewList" class="text-white text-lg font-medium hover:text-green"> 리뷰 </router-link>
          </nav>
        </div>

        <div class="flex items-center space-x-4">
          <!-- 버튼 렌더링: 토큰 유무에 따라 -->
          <template v-if="isLoggedIn">
            <button
              class="px-4 py-2 bg-black bg-opacity-30 h-11 text-white text-lg rounded hover:bg-opacity-50"
              @click="handleLogout"
            >
              로그아웃
            </button>
            <router-link
              to="/mypage"
              class="px-4 py-2 bg-black bg-opacity-30 h-11 text-white text-lg rounded hover:bg-opacity-50"
            >
              마이페이지
            </router-link>
          </template>
          <template v-else>
            <button
              class="px-4 py-2 bg-black bg-opacity-30 h-11 text-white text-lg rounded hover:bg-opacity-50"
              @click="openLoginModal"
            >
              로그인
            </button>
            <button
              class="px-4 py-2 bg-black bg-opacity-30 h-11 text-white text-lg rounded hover:bg-opacity-50"
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
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import axios from 'axios'
import LoginModal from '@/views/Account/Login.vue'
import SignUp from '@/views/Account/SignUp.vue'

export default defineComponent({
  components: {
    LoginModal,
    SignUp,
  },
  setup() {
    const isLoginModalOpen = ref(false)
    const isSignUpModalOpen = ref(false)
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

    const openLoginModal = () => {
      isLoginModalOpen.value = true
    }

    const closeLoginModal = () => {
      isLoginModalOpen.value = false
    }

    const openSignUpModal = () => {
      isSignUpModalOpen.value = true
    }

    const closeSignUpModal = () => {
      isSignUpModalOpen.value = false
    }

    onMounted(() => {
      checkLoginStatus() // 컴포넌트 마운트 시 로그인 상태 확인
    })

    return {
      isLoginModalOpen,
      openLoginModal,
      closeLoginModal,
      isSignUpModalOpen,
      openSignUpModal,
      closeSignUpModal,
      isLoggedIn,
      handleLogout,
      token,
      fetchLogOut,
    }
  },
})
</script>

<style scoped>
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
