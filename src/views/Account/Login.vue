<template>
  <transition name="slide-in">
    <div v-if="isVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="w-full max-w-md bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-center">로그인</h2>
          <button
            class="text-white bg-green w-7 h-7 rounded-full flex justify-center items-center hover:bg-[#BCC199]"
            @click="closeModal"
          >
            X
          </button>
        </div>

        <form @submit.prevent="handleSignIn" class="p-3">
          <div class="mb-4">
            <label for="id" class="block text-sm font-medium text-gray-700 mb-1">아이디</label>
            <input
              type="text"
              id="id"
              v-model="id"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#BCC199]"
            />
          </div>
          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <input
              type="password"
              id="password"
              v-model="password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#BCC199] font-sans"
            />
          </div>
          <button type="submit" class="w-full py-2 bg-green text-white rounded hover:bg-[#BCC199]">로그인</button>
        </form>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import axios, { AxiosError } from 'axios'
import { defineComponent, ref, onMounted } from 'vue'
import { useCookies } from 'vue3-cookies'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'

export default defineComponent({
  name: 'LoginModal',
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['close'],
  setup(_, { emit }) {
    const id = ref('')
    const password = ref('')
    const router = useRouter()
    const { cookies } = useCookies()
    const toast = useToast()
    const refreshAccessToken = async () => {
      const refreshToken = cookies.get('refreshToken')
      if (!refreshToken) throw new Error('No refresh token available')
      console.log('리프래쉬 토큰 실행')
      const response = await axios.post('http://localhost:8080/api/v1/auth/re-token', { refreshToken })

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data
      sessionStorage.setItem('accessToken', newAccessToken)
      cookies.set('refreshToken', newRefreshToken, '7d')
      return newAccessToken
    }

    onMounted(() => {
      axios.interceptors.request.use(
        async (config) => {
          let accessToken = sessionStorage.getItem('accessToken')
          if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`
          }
          return config
        },
        (error) => Promise.reject(error),
      )

      axios.interceptors.response.use(
        (response) => response,
        async (error) => {
          const axiosError = error as AxiosError
          const originalRequest = error.config
          const isLoginRequest = originalRequest.url?.includes('/auth/login')

          if (isLoginRequest) {
            return Promise.reject(error)
          }

          if (axiosError.response && axiosError.response.status === 401) {
            try {
              const newAccessToken = await refreshAccessToken()
              axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`
              originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
              return axios(originalRequest)
            } catch (refreshError) {
              cookies.remove('refreshToken')
              sessionStorage.removeItem('accessToken')
              router.push('/login')
              return Promise.reject(refreshError)
            }
          }
          return Promise.reject(error)
        },
      )
    })

    const handleSignIn = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_APP_BASE_URL}/api/v1/auth/login`,
          {
            loginId: id.value,
            password: password.value,
          },
          { headers: { 'Content-Type': 'application/json' } },
        )
        // console.log('로그인 실행')
        const { accessToken, refreshToken } = response.data
        sessionStorage.setItem('accessToken', accessToken)
        cookies.set('refreshToken', refreshToken, '7d')
        window.location.reload()
      } catch (error) {
        toast.error('로그인에 실패하였습니다.')
      }
    }

    const closeModal = () => {
      emit('close')
    }

    return {
      id,
      password,
      handleSignIn,
      closeModal,
    }
  },
})
</script>

<style scoped>
/* 슬라이드 애니메이션 */
.slide-in-enter-active {
  animation: slideIn 0.6s ease-out forwards;
}
.slide-in-leave-active {
  animation: slideOut 0.6s ease-in forwards;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}

/* 모달 중앙 배치 */
.fixed {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
