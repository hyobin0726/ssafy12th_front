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
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 mb-4"> 새 채널 </DialogTitle>

                <div class="mt-2">
                  <!-- Channel Name -->
                  <div class="mb-4">
                    <input
                      v-model="channelName"
                      type="text"
                      placeholder="Enter a name for your new channel"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p v-if="!channelName" class="text-xs text-red-500 mt-1">This field is required</p>
                  </div>

                  <!-- Channel Type -->
                  <div class="flex gap-4 mb-4">
                    <button
                      @click="channelType = 'public'"
                      :class="[
                        'flex-1 p-3 border rounded-md flex items-center justify-center gap-2',
                        channelType === 'public' ? 'border-blue-500 bg-blue-50' : 'border-gray-300',
                      ]"
                    >
                      <Globe class="w-5 h-5" />
                      <div class="text-left">
                        <div class="font-medium">Public Channel</div>
                        <div class="text-sm text-gray-500">Anyone can join</div>
                      </div>
                    </button>
                    <button
                      @click="channelType = 'private'"
                      :class="[
                        'flex-1 p-3 border rounded-md flex items-center justify-center gap-2',
                        channelType === 'private' ? 'border-blue-500 bg-blue-50' : 'border-gray-300',
                      ]"
                    >
                      <Lock class="w-5 h-5" />
                      <div class="text-left">
                        <div class="font-medium">Private Channel</div>
                        <div class="text-sm text-gray-500">Only invited members</div>
                      </div>
                    </button>
                  </div>

                  <!-- Purpose -->
                  <textarea
                    v-model="purpose"
                    placeholder="Enter a purpose for this channel (optional)"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>

                  <!-- Create Board Checkbox -->
                  <div class="flex items-center mt-4">
                    <input
                      v-model="createBoard"
                      type="checkbox"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label class="ml-2 text-sm text-gray-600"> Create a board for this channel </label>
                  </div>
                </div>

                <div class="mt-6 flex justify-end gap-3">
                  <button
                    @click="closeModal"
                    class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    취소
                  </button>
                  <button
                    @click="handleCreateChannel"
                    :disabled="!channelName"
                    class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    채널 만들기
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

<script setup lang="ts">
import { ref } from 'vue'
import { Globe, Lock } from 'lucide-vue-next'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isModalOpen = ref(false)
const channelName = ref('')
const channelType = ref('public')
const purpose = ref('')
const createBoard = ref(false)

const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  // Reset form
  channelName.value = ''
  channelType.value = 'public'
  purpose.value = ''
  createBoard.value = false
}

const handleCreateChannel = () => {
  if (!channelName.value) return

  // Here you would typically make an API call to create the channel
  console.log({
    name: channelName.value,
    type: channelType.value,
    purpose: purpose.value,
    createBoard: createBoard.value,
  })

  // Close modal and navigate to new channel page
  closeModal()
  router.push('/test')
}
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
