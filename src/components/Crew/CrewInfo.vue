<template>
  <TransitionRoot appear :show="isModalOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-50">
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
              class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-8 shadow-2xl transition-all hover:shadow-blue-500/10 animate-modal-bounce"
            >
              <h2 class="text-2xl font-bold text-gray-900 mb-6 animate-slide-down flex items-center gap-2">
                ✈️ 모임 관리
                <span class="text-blue-500 text-lg animate-pulse">{{ crewName }}</span>
              </h2>

              <div class="space-y-6">
                <!-- 모임 이름 수정 -->
                <div class="animate-fade-in-up" style="animation-delay: 100ms">
                  <label for="crewName" class="block text-sm font-medium text-gray-700">모임 이름</label>
                  <input
                    v-model="crewName"
                    type="text"
                    id="crewName"
                    class="mt-1 w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300 transform hover:scale-102"
                  />
                </div>

                <!-- 회원 검색 및 추가 -->
                <div class="animate-fade-in-up" style="animation-delay: 200ms">
                  <label for="addMember" class="block text-sm font-medium text-gray-700">회원 추가</label>
                  <div class="flex gap-3 mt-1">
                    <input
                      v-model="searchUser"
                      type="text"
                      id="addMember"
                      placeholder="아이디를 입력하세요"
                      class="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                    />
                    <button
                      @click="searchForUser"
                      class="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 hover:rotate-1 active:scale-95 shadow-lg hover:shadow-blue-500/50"
                    >
                      검색
                    </button>
                  </div>
                  <p v-if="searchError" class="mt-2 text-sm text-red-500 animate-shake">{{ searchError }}</p>
                </div>

                <!-- 회원 리스트 -->
                <div class="flex gap-4 animate-fade-in-up" style="animation-delay: 300ms">
                  <!-- 현재 회원 -->
                  <div class="w-1/2 p-4 bg-gray-50 rounded-xl shadow-sm">
                    <h3 class="text-sm font-medium text-gray-700 mb-3">현재 회원</h3>
                    <TransitionGroup
                      tag="ul"
                      class="space-y-2"
                      enter-active-class="transition duration-300 ease-out"
                      enter-from-class="transform scale-95 opacity-0"
                      enter-to-class="transform scale-100 opacity-100"
                      leave-active-class="transition duration-200 ease-in"
                      leave-from-class="transform scale-100 opacity-100"
                      leave-to-class="transform scale-95 opacity-0"
                    >
                      <li
                        v-for="member in crewUsers"
                        :key="member.userId"
                        class="group px-4 py-2 bg-white rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:scale-102 hover:rotate-1"
                      >
                        {{ member.loginId }}
                      </li>
                    </TransitionGroup>
                  </div>

                  <!-- 추가할 회원 -->
                  <div class="w-1/2 p-4 bg-blue-50 rounded-xl shadow-sm">
                    <h3 class="text-sm font-medium text-gray-700 mb-3">추가할 회원</h3>
                    <TransitionGroup
                      tag="ul"
                      class="space-y-2"
                      enter-active-class="transition duration-300 ease-out"
                      enter-from-class="transform -translate-y-4 opacity-0"
                      enter-to-class="transform translate-y-0 opacity-100"
                      leave-active-class="transition duration-200 ease-in"
                      leave-from-class="transform translate-y-0 opacity-100"
                      leave-to-class="transform translate-y-4 opacity-0"
                    >
                      <li
                        v-for="member in addedMembers"
                        :key="member.userId"
                        class="group px-4 py-2 bg-white rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:scale-102 hover:-rotate-1"
                      >
                        {{ member.loginId }}
                      </li>
                    </TransitionGroup>
                  </div>
                </div>

                <!-- 버튼 그룹 -->
                <div class="flex justify-between gap-4 animate-fade-in-up" style="animation-delay: 400ms">
                  <div class="space-x-3">
                    <button
                      @click="updateCrew"
                      class="px-6 py-3 bg-gradient-to-r from-emerald-400 to-teal-300 text-white rounded-xl transition-all duration-300 transform hover:scale-105 hover:rotate-1 active:scale-95 shadow-lg hover:shadow-green-500/50"
                    >
                      수정하기 ✨
                    </button>
                    <button
                      @click="leaveCrew"
                      class="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 hover:-rotate-1 active:scale-95 shadow-lg hover:shadow-gray-500/50"
                    >
                      나가기 👋
                    </button>
                  </div>
                  <div class="space-x-3">
                    <button
                      @click="closeModal"
                      class="px-6 py-3 bg-gradient-to-r from-gray-300 to-gray-300 text-white rounded-xl transition-all duration-300 transform hover:scale-105 hover:rotate-1 active:scale-95"
                    >
                      취소
                    </button>
                    <button
                      @click="deleteCrew"
                      class="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 hover:-rotate-1 active:scale-95 shadow-lg hover:shadow-red-500/50"
                    >
                      삭제 🗑️
                    </button>
                  </div>
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
import { defineComponent, ref, PropType } from 'vue'
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue'
import axios from 'axios'
import type { CrewUser } from '@/types/CrewUser'

export default defineComponent({
  components: {
    Dialog,
    DialogPanel,
    TransitionRoot,
    TransitionChild,
  },
  props: {
    isModalOpen: {
      type: Boolean,
      required: true,
    },
    crewId: {
      type: Number,
      required: true,
    },
    crewNameProp: {
      type: String,
      required: true,
    },
    crewUsersProp: {
      type: Array as PropType<CrewUser[]>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const crewName = ref(props.crewNameProp)
    const searchUser = ref('')
    const searchError = ref('')
    const crewUsers = ref(props.crewUsersProp)
    const addedMembers = ref<{ userId: number; loginId: string }[]>([])
    const closeModal = () => emit('close')

    // 회원 중복 체크 함수
    const isDuplicateUser = (loginId: string): boolean => {
      // 현재 회원 중에서 중복 체크
      const isExistingMember = crewUsers.value.some((user) => user.loginId.toLowerCase() === loginId.toLowerCase())

      // 추가할 회원 목록에서 중복 체크
      const isAlreadyAdded = addedMembers.value.some((user) => user.loginId.toLowerCase() === loginId.toLowerCase())

      return isExistingMember || isAlreadyAdded
    }

    // 회원검색 기능
    const searchForUser = async () => {
      if (!searchUser.value) {
        searchError.value = '아이디를 입력해주세요.'
        return
      }

      try {
        const accessToken = sessionStorage.getItem('accessToken')
        const response = await axios.get(`http://localhost:8080/api/v1/member/search?loginId=${searchUser.value}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })

        // 중복 체크
        if (isDuplicateUser(response.data.loginId)) {
          searchError.value = '이미 존재하는 회원입니다.'
          searchUser.value = '' // 입력 필드 초기화
          return
        }

        addedMembers.value.push(response.data)
        searchError.value = ''
        searchUser.value = '' // 성공적으로 추가 후 입력 필드 초기화
      } catch (error) {
        searchError.value = '사용자를 찾을 수 없습니다.'
      }
    }

    const updateCrew = async () => {
      const accessToken = sessionStorage.getItem('accessToken')
      if (!accessToken) {
        alert('로그인이 필요합니다.')
        return
      }

      try {
        const body = {
          name: crewName.value,
          users: addedMembers.value,
        }
        const response = await axios.put(`http://localhost:8080/api/v1/crew/${props.crewId}`, body, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })

        console.log('모임 수정 성공성공성공 -  ', response)
        alert('모임이 성공적으로 수정되었습니다.')
      } catch (error) {
        console.error('모임 수정 실패:', error)
        alert('모임 수정에 실패했습니다. 다시 시도해주세요.')
      }

      emit('updated', { crewName: crewName.value, addedMembers: addedMembers.value })
    }

    const leaveCrew = async () => {
      console.log('모임 나가기')
      const accessToken = sessionStorage.getItem('accessToken')
      if (!accessToken) {
        alert('로그인이 필요합니다.')
        return
      }

      try {
        await axios.delete(`http://localhost:8080/api/v1/crew/${props.crewId}/leave`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        console.log('모임 나가기 성공:', props.crewId)

        alert('모임에서 나갔습니다.')
      } catch (error) {
        console.error('모임 삭제 실패:', error)
        alert('모임 삭제에 실패했습니다. 다시 시도해주세요.')
      }
      emit('leaved', props.crewId)
    }

    const deleteCrew = async () => {
      console.log('모임 삭제하기')
      const accessToken = sessionStorage.getItem('accessToken')
      if (!accessToken) {
        alert('로그인이 필요합니다.')
        return
      }

      try {
        await axios.delete(`http://localhost:8080/api/v1/crew/${props.crewId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        console.log('모임 삭제 성공:', props.crewId)

        alert('모임이 삭제되었습니다.')
      } catch (error) {
        console.error('모임 삭제 실패:', error)
        alert('모임 삭제에 실패했습니다. 다시 시도해주세요.')
      }

      emit('deleted', props.crewId)
    }

    return {
      crewName,
      searchUser,
      searchError,
      // currentMembers,
      // CrewUsersList,
      addedMembers,
      crewUsers,
      closeModal,
      searchForUser,
      updateCrew,
      leaveCrew,
      deleteCrew,
      isDuplicateUser, //회원 중복체크
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

.animate-modal-bounce {
  animation: modal-bounce 3s ease-in-out infinite;
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

.animate-slide-down {
  animation: slide-down 0.5s ease-out;
}

.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out forwards;
  opacity: 0;
}

.hover\:scale-102:hover {
  transform: scale(1.02);
}
</style>

ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ디자인 개선ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ:
그라데이션 배경과 블러 효과 추가 더 부드러운 모서리 (rounded-2xl) 그림자 효과 강화 버튼에 그라데이션 배경 추가 전체적인
여백과 간격 조정 애니메이션 효과: 모달 진입/퇴장 애니메이션 개선 모달 전체 통통 튀는 효과 각 섹션별 순차적 페이드인 효과
버튼 호버 시 회전 및 확대 효과 에러 메시지 흔들림 효과 회원 리스트 아이템 트랜지션 효과 인터랙션: 모든 입력 필드에
호버/포커스 효과 버튼 클릭 시 눌림 효과 리스트 아이템 호버 시 회전 및 그림자 효과 시각적 요소: 이모지 추가로 친근감 증가
색상 구분으로 기능별 명확성 강화 그라데이션과 그림자로 깊이감 추가
