<template>
  <div>
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
                class="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all"
              >
                <!-- 모임 정보 -->
                <div class="space-y-4">
                  <!-- 1. 모임 이름, 수정 -->
                  <div>
                    <label for="crewName" class="block text-sm font-medium text-gray-700">모임 이름</label>
                    <input
                      v-model="crewName"
                      type="text"
                      id="crewName"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <!-- 2. 회원 추가 -->
                  <div>
                    <label for="addMember" class="block text-sm font-medium text-gray-700">회원 추가</label>
                    <div class="flex gap-2 mt-1">
                      <input
                        v-model="searchUser"
                        type="text"
                        id="addMember"
                        placeholder="아이디 입력"
                        class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                      <button
                        @click="searchForUser"
                        class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                      >
                        검색
                      </button>
                    </div>
                    <p v-if="searchError" class="mt-2 text-sm text-red-600">{{ searchError }}</p>
                  </div>

                  <!-- 3. 회원 리스트 -->
                  <div class="flex gap-4">
                    <div class="w-1/2">
                      <h3 class="text-sm font-medium text-gray-700">현재 회원</h3>
                      <ul class="mt-2 space-y-2">
                        <li
                          v-for="member in currentMembers"
                          :key="member.userId"
                          class="rounded-md bg-gray-100 px-4 py-2 text-sm"
                        >
                          {{ member.loginId }}
                        </li>
                      </ul>
                    </div>
                    <div class="w-1/2">
                      <h3 class="text-sm font-medium text-gray-700">추가할 회원</h3>
                      <ul class="mt-2 space-y-2">
                        <li
                          v-for="member in addedMembers"
                          :key="member.userId"
                          class="rounded-md bg-blue-100 px-4 py-2 text-sm"
                        >
                          {{ member.loginId }}
                        </li>
                      </ul>
                    </div>
                  </div>

                  <!-- 4. 수정/나가기 버튼 -->
                  <div class="flex justify-end gap-4">
                    <button @click="updateCrew" class="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700">
                      수정
                    </button>
                    <button @click="leaveCrew" class="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700">
                      나가기
                    </button>
                  </div>

                  <!-- 5. 삭제 버튼 -->
                  <div class="mt-4 flex justify-end">
                    <button @click="deleteCrew" class="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700">
                      삭제
                    </button>
                  </div>
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
import { defineComponent, ref } from 'vue'
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue'
import axios from 'axios'

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
    currentMembersProp: {
      type: Array as () => { userId: number; loginId: string }[],
      required: true,
    },
  },
  setup(props, { emit }) {
    const crewName = ref(props.crewNameProp)
    const searchUser = ref('')
    const searchError = ref('')
    const currentMembers = ref(props.currentMembersProp)
    const addedMembers = ref<{ userId: number; loginId: string }[]>([])

    const closeModal = () => emit('close')
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
        addedMembers.value.push(response.data)
        searchError.value = ''
      } catch (error) {
        searchError.value = '사용자를 찾을 수 없습니다.'
      }
    }

    const updateCrew = () => {
      emit('updated', { crewName: crewName.value, addedMembers: addedMembers.value })
    }

    const leaveCrew = () => {
      console.log('모임 나가기')
    }

    const deleteCrew = () => {
      emit('deleted', props.crewId)
    }

    return {
      crewName,
      searchUser,
      searchError,
      currentMembers,
      addedMembers,
      closeModal,
      searchForUser,
      updateCrew,
      leaveCrew,
      deleteCrew,
    }
  },
})
</script>

<style scoped>
/* Tailwind 스타일 사용 */
</style>
