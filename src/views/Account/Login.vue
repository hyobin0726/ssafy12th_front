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
import { defineComponent, ref } from 'vue'
import axios, { AxiosError } from 'axios' // AxiosError 타입 임포트
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

    const handleSignIn = async () => {
      console.log('Signing in with:', id.value, password.value)
      // 로그인 처리 로직을 여기에 추가하세요 (예: API 호출)

      try {
        const response = await axios.post(
          'http://localhost:8080/api/v1/auth/login',
          {
            loginId: id.value,
            password: password.value,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )

        console.log('로그인 성공:', response.data)
        // 받은 엑세스 토큰과 리프레시 토큰
        const { accessToken, refreshToken } = response.data

        // 엑세스 토큰을 세션 스토리지에 저장
        sessionStorage.setItem('accessToken', accessToken)

        // refreshToken을 쿠키에 저장 (7일 동안 저장)
        cookies.set('refreshToken', refreshToken, '7d')
        router.push('/')
        // console.log('refreshToken이 쿠키에 저장됨:', cookies.get('refreshToken'))
      } catch (error) {
        const axiosError = error as AxiosError // error를 AxiosError로 캐스팅
        if (axiosError.response && axiosError.response.status === 401) {
          console.log('토큰이 만료되어 새 토큰을 발급받습니다.')

          try {
            const refreshToken = cookies.get('refreshToken')
            const refreshResponse = await axios.post(
              'http://localhost:8080/api/v1/auth/re-token',
              { refreshToken },
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              },
            )

            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data
            sessionStorage.setItem('accessToken', newAccessToken)
            cookies.set('refreshToken', newRefreshToken, '7d')

            // 새 토큰을 사용하여 원래 요청 재시도
            const retryResponse = await axios.post(
              'http://localhost:8080/api/v1/auth/login',
              {
                loginId: id.value,
                password: password.value,
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${newAccessToken}`,
                },
              },
            )

            console.log('재로그인 성공:', retryResponse.data)
            router.push('/')
          } catch (refreshError) {
            console.error('토큰 재발급 실패:', refreshError)
            cookies.remove('refreshToken')
            sessionStorage.removeItem('accessToken')
            router.push('/login')
          }
        } else {
          console.error('로그인 실패:', error)
        }
      }
    }

    return {
      id,
      password,
      handleSignIn,
      cookies,
    }
  },
})
</script>

<style scoped>
/* Tailwind CSS로 스타일을 적용하므로 추가 스타일은 필요하지 않음 */
</style>
