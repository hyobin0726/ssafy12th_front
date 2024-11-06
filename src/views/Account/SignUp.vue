<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-[400px] p-8 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-semibold text-center text-gray-800 mb-6">Create Your Account</h2>

      <form @submit.prevent="handleSignUp">
        <!-- Name Input -->
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            id="name"
            v-model="name"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- ID Input with Check Button -->
        <div class="mb-4">
          <label for="id" class="block text-sm font-medium text-gray-700 mb-1">ID</label>
          <div class="flex">
            <input
              type="text"
              id="id"
              v-model="id"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              @click="checkIdAvailability"
              class="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700"
            >
              Check ID
            </button>
          </div>
          <p v-if="isIdChecked" :class="isIdAvailable ? 'text-green-500' : 'text-red-500'">
            {{ idMessage }}
          </p>
        </div>

        <!-- Email Input with Verification Button -->
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div class="flex">
            <input
              type="email"
              id="email"
              v-model="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              @click="sendEmailVerification"
              class="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700"
            >
              Verify Email
            </button>
          </div>
        </div>

        <!-- Verification Code Input with Timer -->
        <div v-if="isTimerRunning" class="mb-4">
          <label for="verificationCode" class="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
          <div class="flex items-center">
            <input
              type="text"
              id="verificationCode"
              v-model="verificationCode"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter code"
            />
            <span class="px-2 text-sm text-gray-500">{{ minutes }}:{{ seconds.toString().padStart(2, '0') }}</span>
            <button
              type="button"
              @click="verifyCode"
              class="px-4 py-2 bg-green-500 text-white rounded-r hover:bg-green-600"
            >
              Confirm
            </button>
          </div>
          <p class="text-gray-500 text-xs mt-2">Please enter the verification code sent to your email.</p>
        </div>

        <!-- Password Input -->
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Phone Input -->
        <div class="mb-4">
          <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            id="phone"
            v-model="phone"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Birth Input -->
        <div class="mb-6">
          <label for="birth" class="block text-sm font-medium text-gray-700 mb-1">Birth</label>
          <input
            type="date"
            id="birth"
            v-model="birth"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full py-2 bg-[#C49E7B] text-white rounded hover:bg-[#ddb691] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Sign Up
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
  name: 'Signup',
  setup() {
    // Form field refs
    const name = ref('')
    const id = ref('')
    const email = ref('')
    const password = ref('')
    const phone = ref('')
    const birth = ref('')
    const verificationCode = ref('')

    // ID Check
    const isIdAvailable = ref(false)
    const isIdChecked = ref(false)
    const idMessage = ref('')

    // Timer for email verification
    const isTimerRunning = ref(false)
    const minutes = ref(3)
    const seconds = ref(0)
    let timer: ReturnType<typeof setInterval> | undefined

    const checkIdAvailability = () => {
      isIdChecked.value = true
      isIdAvailable.value = id.value !== 'existingId'
      idMessage.value = isIdAvailable.value ? 'ID is available' : 'ID is already taken'
    }

    const startTimer = () => {
      // 기존 타이머 중지 및 초기화
      if (timer) {
        clearInterval(timer)
        timer = undefined
      }

      // 새로운 타이머 시작
      minutes.value = 3
      seconds.value = 0
      isTimerRunning.value = true

      timer = setInterval(() => {
        if (seconds.value === 0) {
          if (minutes.value === 0) {
            clearInterval(timer)
            timer = undefined
            isTimerRunning.value = false // 타이머 종료 시 버튼 활성화
          } else {
            minutes.value -= 1
            seconds.value = 59
          }
        } else {
          seconds.value -= 1
        }
      }, 1000)
    }

    const sendEmailVerification = () => {
      console.log('sendEmailVerification 실행, isTimerRunning:', isTimerRunning.value)
      startTimer() // 타이머 리셋 및 시작
    }

    const verifyCode = () => {
      if (verificationCode.value === '123456') {
        alert('Verification successful!')
        clearInterval(timer)
        isTimerRunning.value = false
      } else {
        alert('Invalid verification code. Please try again.')
      }
    }

    const handleSignUp = () => {
      console.log('Signing up with:', {
        name: name.value,
        id: id.value,
        email: email.value,
        password: password.value,
        phone: phone.value,
        birth: birth.value,
      })
    }

    return {
      name,
      id,
      email,
      password,
      phone,
      birth,
      verificationCode,
      handleSignUp,
      checkIdAvailability,
      isIdAvailable,
      isIdChecked,
      idMessage,
      sendEmailVerification,
      isTimerRunning,
      minutes,
      seconds,
      verifyCode,
    }
  },
})
</script>

<style scoped>
/* Tailwind CSS로 스타일을 적용하므로 추가 스타일은 필요하지 않음 */
</style>
