<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <aside class="w-1/4 bg-gray-100 p-4 border-r relative">
      <div class="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search"
          class="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300"
          v-model="searchQuery"
        />
      </div>
      <ul>
        <li
          v-for="chat in filteredChats"
          :key="chat.userId"
          class="p-2 flex items-center gap-3 cursor-pointer hover:bg-gray-200"
          @click="selectChat(chat)"
        >
          <img :src="chat.profileUrl" alt="Avatar" class="w-10 h-10 rounded-full object-cover" />
          <div class="flex-1">
            <p class="text-sm font-medium">{{ chat.name }}</p>
            <p class="text-xs text-gray-500 truncate">{{ chat.lastMessage }}</p>
          </div>
          <span class="text-xs text-gray-400">{{ chat.time }}</span>
        </li>
      </ul>
      <!-- + 버튼 -->
      <button
        @click="toggleModal"
        class="p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 absolute bottom-4 right-4"
      >
        +
      </button>
    </aside>

    <!-- Chat Panel -->
    <main class="flex-1 flex flex-col">
      <!-- Header -->
      <header class="p-4 border-b flex items-center gap-3">
        <img :src="selectedChat?.profileUrl" alt="Avatar" class="w-10 h-10 rounded-full object-cover" />
        <div>
          <h1 class="text-lg font-medium">{{ selectedChat?.name }}</h1>
          <p class="text-xs text-gray-500">Last seen {{ selectedChat?.lastSeen }}</p>
        </div>
      </header>

      <!-- Chat Messages -->
      <div class="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div
          v-for="(message, index) in selectedChat?.messages"
          :key="index"
          :class="message.isOwn ? 'text-right' : 'text-left'"
          class="mb-4"
        >
          <div
            :class="[
              'inline-block px-4 py-2 rounded-lg',
              message.isOwn ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800',
            ]"
          >
            {{ message.text }}
          </div>
          <p class="text-xs text-gray-500 mt-1">
            {{ message.time }}
          </p>
        </div>
      </div>

      <!-- Input Field -->
      <footer class="p-4 border-t flex items-center gap-3">
        <input
          type="text"
          placeholder="메시지를 입력해주세요"
          class="flex-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300"
          v-model="newMessage"
          @keyup.enter="sendMessage"
        />
        <button class="p-2 bg-green-500 text-white rounded-full hover:bg-green-600" @click="sendMessage">➤</button>
      </footer>
    </main>

    <!-- 회원 검색 모달 -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-4 rounded-md shadow-lg w-1/3">
        <div class="flex justify-between mb-4">
          <h2 class="text-lg font-thin">회원 검색</h2>
          <button class="bg-red-400 text-white rounded-full hover:bg-red-500 w-6 h-6" @click="toggleModal">X</button>
        </div>
        <div class="flex items-center justify-center space-x-2">
          <input
            type="text"
            placeholder="아이디를 입력해주세요"
            v-model="searchLoginId"
            class="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300"
          />
          <button class="w-1/6 bg-green-400 text-white p-2 rounded-md hover:bg-green-500" @click="searchUser">
            검색
          </button>
        </div>
        <ul class="mt-4">
          <div
            v-if="searchResults"
            class="mt-4 p-2 cursor-pointer hover:bg-gray-100"
            @click="startChatWithUser(searchResults)"
          >
            <div class="flex items-center">
              <img :src="searchResults.profileUrl" alt="Profile" class="w-12 h-12 rounded-full mr-2" />
              <div>{{ searchResults.loginId }} ({{ searchResults.name }})</div>
            </div>
          </div>
          <div v-else-if="searchLoginId === ''" class="mt-4 p-2">검색어를 입력해주세요.</div>
          <div v-else-if="searchResults === null" class="mt-4 p-2">검색 결과가 없습니다.</div>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import axios from 'axios'
import type { Member } from '@/types/Member'
export default defineComponent({
  name: 'ChatApp',
  setup() {
    const chats = ref([
      {
        userId: 3,
        name: '허준수',
        profileUrl: 'https://via.placeholder.com/40',
        lastMessage: '입력중..',
        time: '5m ago',
        lastSeen: '5 minutes ago',
        messages: [],
      },
      {
        userId: 4,
        name: '박효빈',
        profileUrl: 'https://via.placeholder.com/40',
        lastMessage: '메롱',
        time: '2h ago',
        lastSeen: '2 hours ago',
        messages: [
          { text: '안녕', time: '12:24 PM', isOwn: true },
          { text: '안녕하세요', time: '12:26 PM', isOwn: false },
          { text: '메롱', time: '12:28 PM', isOwn: true },
        ],
      },
    ])

    const selectedChat = ref(chats.value[0])
    const searchQuery = ref('')
    const newMessage = ref('')
    const isModalOpen = ref(false)
    const searchLoginId = ref('') // 검색어
    const searchResults = ref<Member | null>(null)
    const filteredChats = computed(() => {
      return chats.value.filter((chat) => chat.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
    })

    const selectChat = (chat: (typeof chats.value)[0]) => {
      selectedChat.value = chat
    }

    const sendMessage = () => {
      if (newMessage.value.trim() !== '') {
        selectedChat.value?.messages.push({
          text: newMessage.value,
          time: 'Now',
          isOwn: true,
        })
        newMessage.value = ''
      }
    }
    const toggleModal = () => {
      isModalOpen.value = !isModalOpen.value
    }

    const searchUser = async () => {
      if (searchLoginId.value === '') {
        return
      }
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/v1/member/search`, {
          params: {
            loginId: searchLoginId.value,
          },
        })
        if (response.data) {
          searchResults.value = response.data
        }
        searchLoginId.value = ''
        // console.log('회원 검색 결과:', response.data)
      } catch (error) {
        searchResults.value = null
        searchLoginId.value = ''
        // console.error('회원 검색에 실패했습니다:', error)
      }
    }

    const startChatWithUser = (user: Member) => {
      const existingChat = chats.value.find((chat) => chat.userId === user.userId)

      if (existingChat) {
        selectedChat.value = existingChat
        toggleModal()
        return
      }

      const newChat = {
        userId: user.userId,
        name: user.name,
        profileUrl: user.profileUrl,
        lastMessage: '',
        time: 'Now',
        lastSeen: 'Just now',
        messages: [],
      }

      chats.value.push(newChat)
      selectedChat.value = newChat
      toggleModal()
    }

    return {
      chats,
      selectedChat,
      searchQuery,
      newMessage,
      isModalOpen,
      searchLoginId,
      searchResults,
      toggleModal,
      searchUser,
      startChatWithUser,
      filteredChats,
      selectChat,
      sendMessage,
    }
  },
})
</script>

<style scoped>
/* 모달 관련 스타일 */
</style>
