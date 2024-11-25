<template>
  <div class="relative">
    <!-- Navbar -->
    <header class="absolute top-0 w-full z-[11] transition-all duration-300 p-4 bg-white shadow-lg">
      <div class="flex items-center justify-between py-4">
        <div class="flex items-center space-x-16">
          <router-link to="/" class="flex items-center">
            <span class="text-gray-700 text-lg">Home</span>
          </router-link>
          <nav class="flex items-center space-x-16">
            <router-link to="/map" class="text-gray-700 text-lg font-medium hover:text-green"> 지도 </router-link>
            <router-link to="/crewPage" class="text-gray-700 text-lg font-medium hover:text-green"> 모임 </router-link>
            <router-link to="/chat" class="text-gray-700 text-lg font-medium hover:text-green"> 채팅 </router-link>
            <router-link to="/reviewList" class="text-gray-700 text-lg font-medium hover:text-green">
              리뷰
            </router-link>
          </nav>
        </div>

        <div class="flex items-center space-x-4">
          <button
            class="px-4 py-2 bg-green h-11 text-white text-lg rounded hover:bg-opacity-70"
            @click="openLoginModal"
          >
            로그인
          </button>
          <button
            class="px-4 py-2 bg-green h-11 text-white text-lg rounded hover:bg-opacity-70"
            @click="openSignUpModal"
          >
            회원가입
          </button>
        </div>
      </div>
    </header>

    <!-- Modals -->
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
