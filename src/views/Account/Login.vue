<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-[400px] p-8 bg-white rounded-lg shadow-md">
      <!-- <h2 class="text-2xl font-semibold text-center text-gray-800 mb-6">Welcome Back</h2> -->
      <!-- <h2 class="text-2xl font-semibold text-center text-gray-800 mb-6"></h2> -->
      <div class="flex justify-center mb-6">
        <Logo class="h-28" />
      </div>

      <form @submit.prevent="handleSignIn">
        <!-- ID 입력란 -->
        <div class="mb-4">
          <label for="id" class="block text-sm font-medium text-gray-700 mb-1">아이디</label>
          <input
            type="id"
            id="id"
            v-model="id"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Password 입력란 -->
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <p class="text-sm text-center text-gray-500 mb-4 cursor-pointer hover:underline">비밀번호 찾기</p>

        <button
          type="submit"
          class="w-full py-2 bg-[#C49E7B] text-white rounded hover:bg-[#ddb691] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          로그인
        </button>

        <!-- <button
          type="button"
          class="w-full py-2 mt-4 border border-[#F9E9DA] text-[#dda677] rounded flex items-center justify-center"
        >
          Connect with <span class="ml-2 font-semibold">Facebook</span>
        </button> -->
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import Logo from '@/assets/logo.svg'
import { defineComponent, ref, onMounted } from 'vue'
import axios, { AxiosError } from 'axios'
import { useCookies } from 'vue3-cookies'
import { useRouter } from 'vue-router'

export default defineComponent({
  components: {
    Logo,
  },
  name: 'Login',
  setup() {
    const id = ref('')
    const password = ref('')
    const { cookies } = useCookies()
    const router = useRouter()

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

    return {
      id,
      password,
      handleSignIn,
      //cookies,
    }
  },
})
</script>

<style scoped>
/* Tailwind CSS로 스타일을 적용하므로 추가 스타일은 필요하지 않음 */
</style>
