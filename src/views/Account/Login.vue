<template>
  <transition name="slide-in">
    <div v-if="isVisible" class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-end">
      <div class="w-1/3 h-full bg-white p-6 shadow-md transform">
        <h2 class="text-xl font-bold mb-4">로그인</h2>
        <form @submit.prevent="handleSignIn">
          <div class="mb-4">
            <label for="id" class="block text-sm font-medium text-gray-700 mb-1">아이디</label>
            <input
              type="text"
              id="id"
              v-model="id"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <input
              type="password"
              id="password"
              v-model="password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
            />
          </div>
          <button type="submit" class="w-full py-2 bg-green text-white rounded hover:bg-[#BCC199]">로그인</button>
        </form>
        <button class="mt-6 text-red-500 underline" @click="closeModal">닫기</button>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import axios, { AxiosError } from 'axios'
import { defineComponent, ref, onMounted } from 'vue'
import { useCookies } from 'vue3-cookies'
import { useRouter } from 'vue-router'
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

    // accessToken을 새로 고침하는 함수
    const refreshAccessToken = async () => {
      const refreshToken = cookies.get('refreshToken')
      if (!refreshToken) throw new Error('No refresh token available')
      console.log('리프래쉬 토큰 실행')
      const response = await axios.post('http://localhost:8080/api/v1/auth/re-token', { refreshToken })

      console.log('리프래쉬 반응:', response.data)
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data
      sessionStorage.setItem('accessToken', newAccessToken)
      cookies.set('refreshToken', newRefreshToken, '7d')
      return newAccessToken
    }

    // 초기 설정 및 인터셉터 등록
    onMounted(() => {
      // Axios 요청 인터셉터 설정
      axios.interceptors.request.use(
        async (config) => {
          let accessToken = sessionStorage.getItem('accessToken')
          if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`
          }
          return config
        },
        (error) => {
          return Promise.reject(error)
        },
      )

      // Axios 응답 인터셉터 설정
      axios.interceptors.response.use(
        (response) => {
          return response
        },
        async (error) => {
          const axiosError = error as AxiosError

          // 토큰 만료 처리: 로그인 요청인지 확인
          // const originalRequest = axiosError.config
          const originalRequest = error.config
          const isLoginRequest = originalRequest.url?.includes('/auth/login')

          // 로그인 요청에서 발생한 401 에러는 무시
          if (isLoginRequest) {
            return Promise.reject(error)
          }

          // 토큰 만료 시 리프레시 토큰 사용
          if (axiosError.response && axiosError.response.status === 401) {
            try {
              const newAccessToken = await refreshAccessToken()
              axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`

              // 새로운 토큰으로 원래 요청을 재시도
              originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
              return axios(originalRequest)
            } catch (refreshError) {
              console.error('토큰 재발급 실패:', refreshError)
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

    // 로그인 요청 함수
    const handleSignIn = async () => {
      console.log('Signing in with:', id.value, password.value)

      try {
        const response = await axios.post(
          'http://localhost:8080/api/v1/auth/login',
          {
            loginId: id.value,
            password: password.value,
          },
          { headers: { 'Content-Type': 'application/json' } },
        )

        console.log('로그인 성공:', response.data)
        const { accessToken, refreshToken } = response.data
        sessionStorage.setItem('accessToken', accessToken)
        cookies.set('refreshToken', refreshToken, '7d')
        router.push('/')
      } catch (error) {
        alert('로그인에 실패하였습니다.')
        console.error('로그인 실패:', error)
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
/* 슬라이드 애니메이션 정의 */
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
</style>
