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

export default defineComponent({
  components: {
    Logo,
  },
  name: 'Login',
  setup() {
    const id = ref('')
    const password = ref('')

    const handleSignIn = () => {
      console.log('Signing in with:', id.value, password.value)
      // 로그인 처리 로직을 여기에 추가하세요 (예: API 호출)
    }

    return {
      id,
      password,
      handleSignIn,
    }
  },
})
</script>

<style scoped>
/* Tailwind CSS로 스타일을 적용하므로 추가 스타일은 필요하지 않음 */
</style>
