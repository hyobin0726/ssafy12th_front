<!-- CrewNewCreate.vue -->
<template>
  <TransitionRoot appear :show="true" as="template">
    <Dialog as="div" @close="$emit('close')" class="relative z-50">
      <TransitionChild
        enter="duration-500 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-300 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            enter="transform duration-500 ease-out"
            enter-from="opacity-0 translate-y-8 scale-95"
            enter-to="opacity-100 translate-y-0 scale-100"
            leave="transform duration-300 ease-in"
            leave-from="opacity-100 translate-y-0 scale-100"
            leave-to="opacity-0 translate-y-8 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 shadow-2xl transition-all hover:shadow-blue-500/10 animate-modal-bounce"
            >
              <DialogTitle as="h3" class="text-2xl font-bold text-gray-900 mb-6 animate-slide-down">
                ✈️ 새로운 여행 모임 만들기
              </DialogTitle>

              <div class="space-y-6">
                <!-- 모임명 입력 -->
                <div class="animate-fade-in-up" style="animation-delay: 100ms">
                  <input
                    v-model="channelName"
                    type="text"
                    placeholder="멋진 모임명을 입력하세요"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300 transform hover:scale-[1.02]"
                  />
                  <p v-if="!channelName" class="text-sm text-red-500 mt-2 animate-pulse">모임명은 필수입니다</p>
                </div>

                <!-- 사용자 검색 -->
                <div class="animate-fade-in-up" style="animation-delay: 200ms">
                  <div class="flex gap-3">
                    <input
                      v-model="searchUser"
                      type="text"
                      placeholder="함께할 친구의 아이디"
                      class="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                    />
                    <button
                      @click="searchForUser"
                      class="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 hover:rotate-1 active:scale-95 shadow-lg hover:shadow-blue-500/50"
                    >
                      검색
                    </button>
                  </div>
                  <p v-if="searchError" class="text-sm text-red-500 mt-2 animate-shake">{{ searchError }}</p>
                </div>

                <!-- 초대 목록 -->
                <div v-if="invitedUsers.length" class="animate-fade-in-up" style="animation-delay: 300ms">
                  <p class="text-gray-600 mb-3">✨ 함께할 친구들:</p>
                  <ul class="flex flex-wrap gap-2">
                    <li
                      v-for="user in invitedUsers"
                      :key="user.userId"
                      class="px-4 py-2 bg-blue-50 text-blue-800 rounded-full border border-blue-100 transition-all duration-300 hover:scale-105 hover:rotate-1 hover:bg-blue-100 animate-pop-in"
                    >
                      {{ user.loginId }}
                    </li>
                  </ul>
                </div>

                <!-- 버튼 그룹 -->
                <div class="mt-8 flex justify-end gap-3 animate-fade-in-up" style="animation-delay: 400ms">
                  <button
                    @click="$emit('close')"
                    class="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-300 transform hover:scale-105 hover:-rotate-1 active:scale-95"
                  >
                    취소
                  </button>
                  <button
                    @click="handleCreateChannel"
                    class="px-6 py-3 text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl transition-all duration-300 transform hover:scale-105 hover:rotate-1 active:scale-95 shadow-lg hover:shadow-blue-500/50 hover:from-blue-600 hover:to-blue-700"
                  >
                    모임 만들기 🚀
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import axios from 'axios'

export default defineComponent({
  components: {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionRoot,
    TransitionChild,
  },
  setup(_, { emit }) {
    //모임 생성
    const channelName = ref('')
    const invitedUsers = ref<{ userId: number; loginId: string }[]>([])

    //사용자 검색
    const searchUser = ref('')
    const searchError = ref('')

    // 사용자 검색
    const searchForUser = async () => {
      if (!searchUser.value) {
        searchError.value = '사용자 아이디를 입력하세요.'
        return
      }

      const accessToken = sessionStorage.getItem('accessToken')
      if (!accessToken) {
        console.error('Access token is missing')
        searchError.value = '로그인 상태를 확인해주세요.'
        return
      }

      try {
        // API 호출
        const response = await axios.get(`http://localhost:8080/api/v1/member/search?loginId=${searchUser.value}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        const userData = response.data

        // invitedUsers 배열에 사용자 추가
        invitedUsers.value.push({ userId: userData.userId, loginId: userData.loginId })
        searchUser.value = '' // 입력 필드 초기화
        searchError.value = '' // 에러 메시지 초기화
      } catch (error) {
        console.error('사용자 검색 실패:', error)
        searchError.value = '사용자를 찾을 수 없습니다. 다시 시도해주세요.'
      }
    }

    // 버튼 클릭 핸들러
    const handleCreateChannel = async () => {
      if (!channelName.value) return

      console.log('컴포넌트 모달 : 모임 생성 버튼 클릭')
      console.log('모임 생성:', {
        name: channelName.value,
        invitedUsers: invitedUsers.value,
      })

      // API 요청에 필요한 데이터
      const requestBody = {
        name: channelName.value,
        users: invitedUsers.value,
      }

      // Access Token 가져오기
      const accessToken = sessionStorage.getItem('accessToken')
      if (!accessToken) {
        console.error('Access token is missing')
        return
      }

      try {
        // API 호출
        const response = await axios.post('http://localhost:8080/api/v1/crew/create', requestBody, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        console.log('Crew created successfully:', response.data)

        // 모달 닫고 다른 페이지로 이동
        // closeModal()
        emit('close') // emit을 사용해 close 이벤트를 부모로 전달
        emit('fetchMyCrews')
      } catch (error) {
        console.error('Failed to create crew:', error)
      }
    }
    return {
      channelName,
      searchUser,
      searchForUser,
      searchError,
      invitedUsers,
      handleCreateChannel,
    }
  },
})
</script>

<style>
@keyframes modal-bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

@keyframes pop-in {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  70% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes slide-down {
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-modal-bounce {
  animation: modal-bounce 3s ease-in-out infinite;
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

.animate-pop-in {
  animation: pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.animate-slide-down {
  animation: slide-down 0.5s ease-out;
}

.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out forwards;
  opacity: 0;
}

@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ디자인 개선사항 ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
애니메이션 효과: 모달이 부드럽게 떠오르는 효과 (fade-in-up) 모달 전체가 살짝 통통 튀는 효과 (modal-bounce) 버튼에 hover
시 회전 및 확대 효과 에러 메시지에 흔들림 효과 (shake) 초대된 사용자 태그가 팝업되는 효과 (pop-in) 시각적 개선:
그라데이션 배경과 블러 효과 더 부드러운 모서리 (rounded-2xl) 입력 필드와 버튼의 크기 증가 그림자 효과 강화 및 hover 시
변화 인터랙션: 모든 요소에 hover 효과 추가 버튼 클릭 시 눌림 효과 (active:scale-95) 입력 필드 focus 시 부드러운 테두리
변화 기타: 이모지 추가로 친근감 증가 순차적인 애니메이션으로 시각적 흐름 개선 전체적으로 더 넓은 여백과 간격 사용
