<template>
  <div class="relative">
    <!-- Navbar -->
    <header class="absolute top-0 w-full z-[8] transition-all duration-300 p-4 bg-white shadow-lg">
      <div class="flex items-center justify-between py-4">
        <div class="flex items-center space-x-16">
          <router-link to="/" class="flex items-center">
            <span class="text-gray-700 text-lg">Home</span>
          </router-link>
          <nav class="flex items-center space-x-16">
            <router-link to="/map" class="text-gray-700 text-lg font-medium hover:text-green"> 지도 </router-link>
            <span class="text-gray-700 text-lg font-medium hover:text-green" @click="clickCrew"> 모임 </span>
            <span class="text-gray-700 text-lg font-medium hover:text-green" @click="clickChat"> 채팅 </span>
            <router-link to="/reviewList" class="text-gray-700 text-lg font-medium hover:text-green">
              리뷰
            </router-link>
          </nav>
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

    <!-- Modals -->
    <LoginModal @close="closeLoginModal" :isVisible="isLoginModalOpen" />
    <SignUp @close="closeSignUpModal" :isVisible="isSignUpModalOpen" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import axios from 'axios'
import LoginModal from '@/views/Account/Login.vue'
import SignUp from '@/views/Account/SignUp.vue'
import { useToast } from 'vue-toast-notification'
import { useRouter } from 'vue-router'
export default defineComponent({
  components: {
    LoginModal,
    SignUp,
  },
  setup() {
    const isLoginModalOpen = ref(false)
    const isSignUpModalOpen = ref(false)
    const isLoggedIn = ref(false) // 로그인 상태
    const toast = useToast()
    const router = useRouter()
    // 로그인 상태 확인
    const checkLoginStatus = () => {
      const token = sessionStorage.getItem('accessToken')
      isLoggedIn.value = !!token // 토큰이 있으면 true, 없으면 false
    }
    const token = sessionStorage.getItem('accessToken')
    const clickCrew = () => {
      if (!isLoggedIn.value) {
        toast.error('로그인 후 이용해주세요.')
        return
      }
      router.push('/crewPage')
    }

    const clickChat = () => {
      if (!isLoggedIn.value) {
        toast.error('로그인 후 이용해주세요.')
        return
      }
      router.push('/chat')
    }

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
    const handleLogout = async () => {
      await fetchLogOut() // 로그아웃 요청
      checkLoginStatus() // 상태 다시 확인
      toast.success('로그아웃되었습니다.')
      // alert('로그아웃되었습니다.')
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
      clickCrew,
      clickChat,
    }
  },
})
</script>

<style scoped>
/* 헤더에 그림자 추가 */
header {
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* 애니메이션 및 효과 */
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

header {
  animation: fadeIn 0.6s ease-in-out;
}

button:active {
  animation: buttonPress 0.1s ease-in-out;
  transform: scale(0.95);
}
</style>
