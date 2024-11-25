<template>
  <transition name="slide-in">
    <div v-if="isVisible" class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="w-full max-w-md bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-center">회원가입</h2>
          <button
            class="text-white bg-green w-7 h-7 rounded-full flex justify-center items-center hover:bg-[#BCC199]"
            @click="closeModal"
          >
            X
          </button>
        </div>

        <form @submit.prevent="handleSignUp" class="space-y-4">
          <!-- 이름 입력 -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">이름</label>
            <input
              type="text"
              id="name"
              v-model="name"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#BCC199]"
              placeholder="이름"
            />
            <p v-if="name && !isNameValid" class="text-red-500 text-sm mt-1">
              이름은 한글, 영어만 입력 가능합니다 (최대 255자).
            </p>
          </div>

          <!-- 아이디 입력 -->
          <div>
            <label for="id" class="block text-sm font-medium text-gray-700">아이디</label>
            <div class="flex">
              <input
                type="text"
                id="loginId"
                v-model="loginId"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-l focus:outline-none focus:border-[#BCC199]"
                placeholder="아이디"
                @input="clearIdMessage"
              />
              <button
                type="button"
                @click="checkIdAvailability"
                :disabled="!isIdValid"
                class="px-4 py-2 bg-green text-white rounded-r hover:bg-[#BCC199]"
              >
                중복 확인
              </button>
            </div>
            <p v-if="loginId && !isIdValid" class="text-red-500 text-sm mt-1">
              아이디는 8~20자, 숫자와 영문만 포함 가능, 특수문자 금지입니다.
            </p>
            <p v-if="isIdChecked" :class="isIdAvailable ? 'text-green-500' : 'text-red-500'">
              {{ idMessage }}
            </p>
          </div>

          <!-- 이메일 입력 -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">이메일</label>
            <div class="flex">
              <input
                type="email"
                id="email"
                v-model="email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-l focus:outline-none focus:border-[#BCC199]"
                placeholder="이메일"
              />
              <button
                type="button"
                @click="sendEmailVerification"
                class="px-4 py-2 bg-green text-white rounded-r hover:bg-[#BCC199]"
              >
                인증 요청
              </button>
            </div>
            <p v-if="email && !isEmailValid" class="text-red-500 text-sm mt-1">유효한 이메일 주소를 입력해주세요.</p>
          </div>
          <!-- 이메일 인증번호 Verification Code Input with Timer -->
          <div v-if="isTimerRunning" class="mb-4">
            <label for="verificationCode" class="block text-sm font-medium text-gray-700 mb-1">인증번호</label>
            <div class="flex items-center">
              <input
                type="text"
                id="verificationCode"
                v-model="verificationCode"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-l focus:outline-none focus:border-[#BCC199]"
                placeholder="인증번호 입력"
              />
              <span class="px-2 text-sm text-gray-500">{{ minutes }}:{{ seconds.toString().padStart(2, '0') }}</span>
              <button
                type="button"
                @click="verifyCode"
                class="px-4 py-2 text-white rounded-r hover:bg-green-600 bg-green hover:bg-[#BCC199]"
              >
                확인
              </button>
            </div>
            <!-- 인증번호 유효성 검사 메시지 -->
            <p v-if="verificationCode && !isCodeValid" class="text-red-500 text-sm mt-1">
              유효한 인증번호를 입력해주세요.
            </p>
            <p class="text-gray-500 text-xs mt-2">이메일로 전송된 인증 코드를 입력하세요.</p>
          </div>
          <!-- 비밀번호 입력 -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">비밀번호</label>
            <input
              type="password"
              id="password"
              v-model="password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#BCC199] font-sans"
              placeholder="비밀번호"
            />
            <p v-if="password && !isPasswordValid" class="text-red-500 text-sm mt-1">
              비밀번호는 8~20자, 숫자, 영문, 특수문자가 모두 포함되어야 합니다.
            </p>
          </div>

          <!-- 비밀번호 확인 -->
          <div>
            <label for="passwordConfirm" class="block text-sm font-medium text-gray-700">비밀번호 확인</label>
            <input
              type="password"
              id="passwordConfirm"
              v-model="passwordConfirm"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#BCC199] font-sans"
              placeholder="비밀번호 확인"
            />
            <p v-if="passwordConfirm && password !== passwordConfirm" class="text-red-500 text-sm mt-1">
              비밀번호가 일치하지 않습니다.
            </p>
          </div>
          <!-- 휴대전화 입력란 Phone Input -->
          <div class="mb-4">
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">휴대전화</label>
            <input
              type="tel"
              id="phone"
              v-model="phone"
              required
              placeholder="휴대전화 번호를 입력"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#BCC199]"
            />
            <p v-if="phone && !isPhoneValid" class="text-red-500 text-sm mt-1">
              휴대전화는 10~11자리 숫자만 입력 가능합니다 (010-0000-0000 형식).
            </p>
          </div>

          <!-- 생년월일 입력란 Birth Input -->
          <div class="mb-6">
            <label for="birth" class="block text-sm font-medium text-gray-700 mb-1">생년월일</label>
            <input
              type="date"
              id="birth"
              v-model="birth"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#BCC199]"
            />
          </div>

          <!-- Submit 버튼 -->
          <button
            type="submit"
            class="w-full py-2 bg-green hover:bg-[#BCC199] text-white rounded hover:bg-green-500 focus:outline-none focus:border-[#BCC199]"
            :disabled="!isFormValid"
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Logo from '@/assets/logo.svg'
import { defineComponent, ref, computed, watch } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
export default defineComponent({
  components: {
    Logo,
  },
  name: 'Signup',
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['close'],
  setup(_, { emit }) {
    const router = useRouter()
    // Form field refs
    const name = ref('')
    const loginId = ref('')
    const email = ref('')
    const password = ref('')
    const passwordConfirm = ref('')
    const phone = ref('')
    const birth = ref('')
    const verificationCode = ref('')

    // ID Check
    const isIdChecked = ref(false)
    const isIdAvailable = ref(false)
    const idMessage = ref('')
    const isIdValidCheck = ref(true)

    // Timer for email verification
    const isTimerRunning = ref(false)
    const minutes = ref(3)
    const seconds = ref(0)
    let timer: ReturnType<typeof setInterval> | undefined

    // Validation Functions
    const isNameValid = computed<boolean>(() => /^[a-zA-Z가-힣]{1,255}$/.test(name.value))
    const isIdValid = computed<boolean>(() => /^[a-zA-Z0-9]{8,20}$/.test(loginId.value))
    const isEmailValid = computed<boolean>(() => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.value))
    const isCodeValid = ref(false)
    const isPasswordValid = computed<boolean>(() =>
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/.test(password.value),
    )
    const isPhoneValid = computed<boolean>(() => /^010-\d{4}-\d{4}$/.test(phone.value))

    // Form Validation Check
    const isFormValid = computed<boolean>(
      () =>
        isNameValid.value &&
        isIdValid.value &&
        isEmailValid.value &&
        isPasswordValid.value &&
        isCodeValid.value &&
        password.value === passwordConfirm.value &&
        isPhoneValid.value,
    )

    // 아이디 중복 체크 함수
    const checkIdAvailability = async () => {
      // ID 중복 체크 활성화
      isIdChecked.value = true

      try {
        // Axios GET 요청으로 아이디 중복 확인
        const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/v1/auth/duplication`, {
          params: { login_id: loginId.value },
        })

        // 성공적으로 사용 가능한 아이디일 경우
        if (response.status === 200) {
          isIdAvailable.value = true
          idMessage.value = '사용 가능한 아이디입니다.'
        }
      } catch (error) {
        console.error('아이디 중복입니다:', error)
        isIdAvailable.value = false
        idMessage.value = '이미 사용 중인 아이디입니다.'
        // 에러 응답일 경우 이미 사용 중인 아이디로 간주
        // if (error.response && error.response.status === 409) {
        //   isIdAvailable.value = false
        //   idMessage.value = '이미 사용 중인 아이디입니다.'
        // } else {
        //   console.error('아이디 체크 중 오류 발생:', error)
        // }
      }
    }

    //메세지를 초기화
    const clearIdMessage = () => {
      idMessage.value = '' // 메시지를 초기화
    }

    const startTimer = () => {
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

    // const sendEmailVerification = () => {
    //   console.log('sendEmailVerification 실행, isTimerRunning:', isTimerRunning.value)
    //   startTimer() // 타이머 리셋 및 시작
    // }

    // 인증 코드 전송 함수
    const sendEmailVerification = async () => {
      if (!isEmailValid.value) return

      try {
        // 인증 코드 전송 API 요청
        const response = await axios.post(
          `${import.meta.env.VITE_APP_BASE_URL}/api/v1/auth/email`,
          {
            email: email.value,
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        )

        if (response.status === 200) {
          alert('인증 코드가 이메일로 전송되었습니다.')
          startTimer() // 타이머 시작
        }
      } catch (error) {
        console.error('이메일 인증 코드 전송 실패:', error)
        alert('이메일 인증 코드 전송에 실패했습니다. 다시 시도해 주세요.')
      }
    }

    // 인증 코드 확인 함수
    const verifyCode = async () => {
      try {
        // 인증 코드 확인 API 요청
        const response = await axios.post(
          `${import.meta.env.VITE_APP_BASE_URL}/api/v1/auth/email/verify`,
          {
            email: email.value,
            code: verificationCode.value,
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        )

        if (response.status === 200) {
          alert('인증이 완료되었습니다!')
          clearInterval(timer)
          isTimerRunning.value = false // 타이머 중지
          isCodeValid.value = true // 인증 성공 시 유효성 업데이트
        }
      } catch (error) {
        console.error('인증 코드 확인 실패:', error)
        alert('인증 코드가 올바르지 않습니다. 다시 확인해 주세요.')
        isCodeValid.value = false // 인증 실패 시 유효성 업데이트
      }
    }

    const handleSignUp = async () => {
      alert('회원가입이 완료되었습니다.')
      // 비밀번호와 확인이 일치하면 회원가입 데이터 출력
      console.log('Signing up with:', {
        name: name.value,
        loginId: loginId.value,
        email: email.value,
        password: password.value,
        phone: phone.value,
        birth: birth.value,
      })

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_APP_BASE_URL}/api/v1/auth/join`,
          {
            name: name.value,
            loginId: loginId.value,
            email: email.value,
            password: password.value,
            phone: phone.value,
            birth: birth.value,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        window.location.reload()
        console.log('회원가입 성공:', response.data)
        // router.push('/')
      } catch (error) {
        console.error('회원가입 실패:', error)
      }
    }

    // const handleSignUp = () => {
    //   // 비밀번호 확인
    //   if (password.value !== passwordConfirm.value) {
    //     alert('비밀번호가 일치하지 않습니다.')
    //     return
    //   }

    //   // 비밀번호와 확인이 일치하면 회원가입 데이터 출력
    //   console.log('Signing up with:', {
    //     name: name.value,
    //     id: id.value,
    //     email: email.value,
    //     password: password.value,
    //     phone: phone.value,
    //     birth: birth.value,
    //   })
    // }
    const closeModal = () => {
      emit('close')
    }
    return {
      name,
      loginId,
      email,
      password,
      passwordConfirm,
      phone,
      birth,
      verificationCode,
      isIdChecked,
      isIdAvailable,
      idMessage,
      isTimerRunning,
      minutes,
      seconds,

      isNameValid,
      isIdValid,
      isEmailValid,
      isPasswordValid,
      isCodeValid,
      isPhoneValid,
      isFormValid,
      checkIdAvailability,
      clearIdMessage,
      sendEmailVerification,
      handleSignUp,
      verifyCode,
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
