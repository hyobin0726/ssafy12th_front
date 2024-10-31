<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-[400px] p-8 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-semibold text-center text-gray-800 mb-6">Welcome Back</h2>

      <form @submit.prevent="handleSignIn">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <p class="text-sm text-center text-gray-500 mb-4 cursor-pointer hover:underline">Forgot password?</p>

        <button
          type="submit"
          class="w-full py-2 bg-[#C49E7B] text-white rounded hover:bg-[#ddb691] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Sign In
        </button>

        <button
          type="button"
          class="w-full py-2 mt-4 border border-[#F9E9DA] text-[#dda677] rounded flex items-center justify-center"
        >
          Connect with <span class="ml-2 font-semibold">Facebook</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Login',
  setup() {
    const email = ref('')
    const password = ref('')

    const handleSignIn = () => {
      console.log('Signing in with:', email.value, password.value)
      // 로그인 처리 로직을 여기에 추가하세요 (예: API 호출)
    }

    return {
      email,
      password,
      handleSignIn,
    }
  },
})
</script>

<style scoped>
/* Tailwind CSS로 스타일을 적용하므로 추가 스타일은 필요하지 않음 */
</style>
