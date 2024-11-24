<!-- MeetingCreate.vue -->
<template>
  <div class="min-h-screen bg-white flex flex-col items-center justify-center">
    <!-- Main Content -->
    <div class="text-center">
      <h1 class="text-6xl font-serif mb-4 tracking-wide text-gray-800 animate-fadeIn">Create a meeting</h1>
      <p class="text-gray-600 mb-8 animate-slideUp">CREATE YOUR MEETING GROUP</p>

      <button
        @click="openModal"
        class="bg-gray-800 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-700 transition-all duration-300 animate-scaleIn"
      >
        START
      </button>
    </div>

    <!-- Modal -->
    <TransitionRoot appear :show="isModalOpen" as="template">
      <Dialog as="div" @close="closeModal" class="relative z-50">
        <TransitionChild
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel
                class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all"
              >
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 mb-4"
                  >새 모임 만들기</DialogTitle
                >

                <!-- 모임명 입력 -->
                <div class="mb-4">
                  <input
                    v-model="channelName"
                    type="text"
                    placeholder="모임명을 입력하세요"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p v-if="!channelName" class="text-xs text-red-500 mt-1">모임명은 필수입니다.</p>
                </div>

                <!-- 사용자 검색 -->
                <div class="mb-4">
                  <div class="flex gap-2">
                    <input
                      v-model="searchUser"
                      type="text"
                      placeholder="사용자 아이디 입력"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      @click="searchForUser"
                      class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      검색
                    </button>
                  </div>
                  <p v-if="searchError" class="text-xs text-red-500 mt-1">{{ searchError }}</p>
                </div>

                <!-- 초대 목록 -->
                <div v-if="invitedUsers.length" class="mb-4">
                  <p class="text-gray-600 mb-2">초대된 사용자:</p>
                  <ul class="flex flex-wrap gap-2">
                    <li
                      v-for="user in invitedUsers"
                      :key="user.userId"
                      class="px-3 py-1 bg-blue-100 text-blue-800 rounded-md"
                    >
                      {{ user.loginId }}
                    </li>
                  </ul>
                </div>

                <!-- 모임 생성 버튼 -->
                <div class="mt-6 flex justify-end gap-3">
                  <button
                    @click="closeModal"
                    class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    취소
                  </button>
                  <button
                    @click="handleCreateChannel"
                    class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    모임 만들기
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

export default defineComponent({
  components: {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionRoot,
    TransitionChild,
  },
  setup() {
    const router = useRouter()
    const isModalOpen = ref(false)
    const channelName = ref('')

    const searchUser = ref('')
    const invitedUsers = ref<{ userId: number; loginId: string }[]>([])
    const searchError = ref('')

    // 모달 열기
    const openModal = () => {
      isModalOpen.value = true
    }

    // 모달 닫기
    const closeModal = () => {
      isModalOpen.value = false
      channelName.value = ''
      searchUser.value = ''
      invitedUsers.value = []
      searchError.value = ''
    }

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

    const handleCreateChannel = async () => {
      if (!channelName.value) return

      // Here you would typically make an API call to create the channel
      // console.log({
      //   name: channelName.value,
      //   type: channelType.value,
      //   purpose: purpose.value,
      //   createBoard: createBoard.value,
      // })
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
        closeModal()
        router.push('/crewPage')
      } catch (error) {
        console.error('Failed to create crew:', error)
      }
    }

    return {
      isModalOpen,
      openModal,
      closeModal,
      channelName,
      searchUser,
      searchForUser,
      searchError,
      invitedUsers,
      handleCreateChannel,
      Dialog,
      DialogPanel,
      DialogTitle,
      TransitionRoot,
      TransitionChild,
    }
  },
})
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 1.5s ease-in forwards;
}

.animate-slideUp {
  animation: slideUp 1s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.animate-scaleIn {
  animation: scaleIn 0.5s ease-out forwards;
  opacity: 0;
  transform: scale(0.9);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
