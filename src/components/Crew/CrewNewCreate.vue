<!-- KoreaMap.vue -->
<template>
  <!-- 심플한 헤더 -->
  <!-- Header -->
  <!-- 모임 생성 모달 -->
  <!-- Modal -->
  <!-- <div class="min-h-screen bg-white flex flex-col items-center justify-center"> -->
  <TransitionRoot appear :show="isCrewModalOpen" as="template">
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
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 mb-4">새 모임 만들기</DialogTitle>

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
                  <button @click="searchForUser" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
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
                  @click="handleCreateCrew"
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
  <!-- </div> -->
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
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
  setup() {
    //모임 모달 상태
    const isCrewModalOpen = ref(false)

    //모임 생성
    const channelName = ref('')
    const searchUser = ref('')
    const invitedUsers = ref<{ userId: number; loginId: string }[]>([])
    const searchError = ref('')

    // Close Modal
    const closeModal = () => {
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

    // 버튼 클릭 핸들러
    const handleCreateCrew = async () => {
      if (!channelName.value) return

      console.log('모임 생성 버튼 클릭')
      // 모임 생성 로직 추가

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
      } catch (error) {
        console.error('Failed to create crew:', error)
      }
    }
    return {
      isCrewModalOpen,
      closeModal,
      channelName,
      searchUser,
      searchForUser,
      searchError,
      invitedUsers,
      handleCreateCrew,
    }
  },
})
</script>

<style scoped>
/* 필요한 스타일 */
</style>
