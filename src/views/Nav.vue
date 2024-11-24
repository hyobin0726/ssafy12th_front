<template>
  <div class="relative">
    <!-- 비디오 태그로 배경 비디오 재생하는 부분 나중에 지우기 -->
    <video autoplay muted loop class="w-full h-full object-cover">
      <source src="@/assets/MainView.mp4" type="video/mp4" />
    </video>

    <header class="absolute top-0 w-full z-50 transition-all duration-300 p-6">
      <div class="flex items-center justify-between py-4">
        <div class="flex items-center space-x-16">
          <router-link to="/" class="flex items-center">
            <img src="@/assets/logo.svg" alt="Logo" class="h-8 w-auto text-white" />
          </router-link>
          <nav class="flex items-center space-x-16">
            <router-link to="/map" class="text-white text-lg font-medium hover:text-green"> 지도 </router-link>
            <router-link to="/crewPage" class="text-white text-lg font-medium hover:text-green"> 모임 </router-link>
            <router-link to="/chat" class="text-white text-lg font-medium hover:text-green"> 채팅 </router-link>
            <router-link to="/reviewList" class="text-white text-lg font-medium hover:text-green"> 리뷰 </router-link>
          </nav>
        </div>

        <div class="flex items-center space-x-4">
          <button
            class="px-4 py-2 bg-black bg-opacity-30 h-11 text-white text-sm font-medium rounded hover:bg-opacity-50"
            @click="openLoginModal"
          >
            로그인
          </button>
          <button
            class="px-4 py-2 bg-black bg-opacity-30 h-11 text-white text-sm font-medium rounded hover:bg-opacity-50"
            @click="openSignUpModal"
          >
            회원가입
          </button>
        </div>
      </div>
    </header>
    <LoginModal @close="closeLoginModal" :isVisible="isLoginModalOpen" />
    <SignUp @close="closeSignUpModal" :isVisible="isSignUpModalOpen" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import LoginModal from '@/views/Account/Login.vue'
import SignUp from '@/views/Account/SignUp.vue'

export default defineComponent({
  components: {
    LoginModal,
    SignUp,
  },
  setup() {
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
    return {
      isLoginModalOpen,
      openLoginModal,
      closeLoginModal,
      isSignUpModalOpen,
      openSignUpModal,
      closeSignUpModal,
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
