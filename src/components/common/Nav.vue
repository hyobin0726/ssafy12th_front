<template>
  <div class="relative">
    <header class="absolute top-0 w-full z-[8] transition-all duration-300 p-6">
      <div class="flex items-center justify-between py-4">
        <div class="flex items-center space-x-16">
          <router-link to="/" class="flex items-center space-x-2 justify-center">
            <img
              src="https://dangnagi-buket.s3.ap-northeast-2.amazonaws.com/image_1732617275874_logo.svg"
              alt="logo"
              class="w-[56.5px] h-[75px] object-cover"
            />

            <span class="text-white text-2xl">당나기</span>
          </router-link>
          <nav class="flex items-center space-x-16">
            <router-link to="/map" class="text-white text-lg font-medium hover:text-green"> 지도 </router-link>
            <span class="text-white text-lg font-medium hover:text-green" @click="clickCrew"> 모임 </span>
            <span class="text-white text-lg font-medium hover:text-green" @click="clickChat"> 채팅 </span>
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
    const isLoggedIn = ref(false)
    const toast = useToast()
    const router = useRouter()

    // 로그인 상태 확인
    const checkLoginStatus = () => {
      const token = sessionStorage.getItem('accessToken')
      isLoggedIn.value = !!token // 토큰 유무에 따라 상태 갱신
    }

    const clickCrew = () => {
      if (!isLoggedIn.value) {
        // isLoggedIn 상태 기반으로 접근 제한
        toast.error('로그인 후 이용해주세요.')
        return
      }
      router.push('/crewPage')
    }

    const clickChat = () => {
      if (!isLoggedIn.value) {
        // isLoggedIn 상태 기반으로 접근 제한
        toast.error('로그인 후 이용해주세요.')
        return
      }
      router.push('/chat')
    }

    const fetchLogOut = async () => {
      try {
        await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/api/v1/auth/logout`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
          },
        })
        sessionStorage.removeItem('accessToken') // 토큰 제거
        isLoggedIn.value = false // 상태 갱신
        toast.success('로그아웃되었습니다.')
      } catch (error) {
        console.error(error)
      }
    }

    const handleLogout = async () => {
      await fetchLogOut() // 로그아웃 요청
      checkLoginStatus() // 상태 다시 확인
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
      checkLoginStatus() // 초기 상태 확인
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
      clickCrew,
      clickChat,
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
