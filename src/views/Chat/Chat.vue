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
          :key="chat.roomId"
          class="p-2 flex items-center gap-3 cursor-pointer hover:bg-gray-200"
          @click="selectChat(chat)"
        >
          <img :src="chat.participant?.profileUrl" alt="Avatar" class="w-10 h-10 rounded-full object-cover" />
          <div class="flex flex-col">
            <p class="text-sm font-medium">{{ chat.participant?.loginId }}</p>
            <p class="text-xs text-gray-500 truncate">{{ chat.lastMessage }}</p>
          </div>
          <span class="text-xs text-gray-400">{{ formatTimestamp(chat.timestamp) }}</span>
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
      <header class="p-4 border-b flex items-center gap-3">
        <div v-if="selectedChat">
          <img :src="selectedChat?.participant?.profileUrl" alt="Avatar" class="w-10 h-10 rounded-full object-cover" />
          <div>
            <h1 class="text-lg font-medium">{{ selectedChat?.participant?.name }}</h1>
            <p class="text-xs text-gray-500">{{ selectedChat?.participant?.loginId }}</p>
          </div>
        </div>
        <div v-else>
          <p class="text-lg font-medium text-center">채팅 시작하기</p>
        </div>
      </header>

      <!-- Chat Messages -->
      <div class="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="message.senderId === currentUserId ? 'text-right' : 'text-left'"
          class="mb-4"
        >
          <div
            :class="[
              'inline-block px-4 py-2 rounded-lg',
              message.senderId === currentUserId ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800',
            ]"
          >
            {{ message.message }}
          </div>
          <p class="text-xs text-gray-500 mt-1">{{ formatTimestamp(message.timestamp) }}</p>
        </div>
      </div>

      <!-- Input Field -->
      <footer class="p-4 border-t flex items-center gap-3">
        <input
          type="text"
          placeholder="메시지를 입력해주세요"
          class="flex-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300"
          v-model="newMessage"
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
            @keyup.enter="searchUser"
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
import { defineComponent, ref, computed, onMounted } from 'vue'
import {
  collection,
  doc,
  getFirestore,
  addDoc,
  query,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  where,
  getDocs,
  Timestamp,
  orderBy,
} from 'firebase/firestore'
import type { ChatRoom, Message } from '@/types/Chat'
import type { Member } from '@/types/Member'
import { db } from '@/services/firebase'
import axios from 'axios'

export default defineComponent({
  name: 'ChatApp',
  setup() {
    const chats = ref<ChatRoom[]>([])
    const messages = ref<Message[]>([])
    const selectedChat = ref<ChatRoom | null>(null)
    const searchQuery = ref('')
    const newMessage = ref('')
    const isModalOpen = ref(false)
    const searchLoginId = ref('')
    const searchResults = ref<Member | null>(null)
    const currentUserId = ref<number>(0)
    const formatTimestamp = (timestamp: Timestamp) => {
      if (!timestamp) return ''

      const date = timestamp.toDate()
      return date.toLocaleString('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    }
    const filteredChats = computed(() =>
      chats.value.filter((chat) => chat.participant.loginId.toLowerCase().includes(searchQuery.value.toLowerCase())),
    )

    const fetchChatRooms = async () => {
      const q = query(
        collection(db, 'chatRooms'),
        where('participants', 'array-contains', currentUserId.value),
        orderBy('timestamp', 'desc'),
      )

      onSnapshot(q, async (snapshot) => {
        const rooms = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const room = doc.data()
            const otherUserId = room.participants.find((id: number) => id !== currentUserId.value)

            let userData = null
            try {
              const response = await axios.get(`http://localhost:8080/api/v1/member/${otherUserId}`)
              userData = response.data
            } catch (error) {
              console.error(`Failed to fetch user data for userId: ${otherUserId}`, error)
              userData = {
                userId: otherUserId,
                name: '알 수 없음',
                profileUrl: '',
                loginId: 'unknown',
              }
            }

            return {
              roomId: doc.id,
              lastMessage: room.lastMessage,
              timestamp: room.timestamp,
              participant: userData,
              participants: room.participants,
            }
          }),
        )

        chats.value = rooms as ChatRoom[]
      })
    }
    const selectChat = async (chat: ChatRoom) => {
      selectedChat.value = chat
      const messagesRef = collection(db, 'chatRooms', chat.roomId, 'messages')
      const messagesQuery = query(messagesRef, orderBy('timestamp', 'desc'))
      onSnapshot(messagesQuery, (snapshot) => {
        messages.value = snapshot.docs.map((doc) => doc.data() as Message).reverse()
      })
    }

    const sendMessage = async () => {
      if (!selectedChat.value || newMessage.value.trim() === '') return

      const recipientId = selectedChat.value.participants.find((id) => id !== currentUserId.value)

      // console.log('currentUserId:', currentUserId.value, 'recipientId:', recipientId)

      const messagesRef = collection(db, 'chatRooms', selectedChat.value.roomId, 'messages')

      await addDoc(messagesRef, {
        senderId: currentUserId.value,
        recipientId,
        message: newMessage.value,
        timestamp: serverTimestamp(),
      })

      const chatRoomRef = doc(db, 'chatRooms', selectedChat.value.roomId)
      await updateDoc(chatRoomRef, {
        lastMessage: newMessage.value,
        timestamp: serverTimestamp(),
      })

      newMessage.value = ''
    }

    const fetchMyId = async () => {
      const token = sessionStorage.getItem('accessToken')
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/v1/member`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        currentUserId.value = response.data.userId
      } catch (error) {
        console.error('사용자 정보를 가져오는데 실패했습니다:', error)
      }
    }
    const searchUser = async () => {
      if (searchLoginId.value === '') return
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/v1/member/search`, {
          params: {
            loginId: searchLoginId.value,
          },
        })
        if (response.data) {
          searchResults.value = response.data as Member
        } else {
          searchResults.value = null
        }
      } catch (error) {
        console.error('회원 검색에 실패했습니다:', error)
        searchResults.value = null
      }
    }

    const startChatWithUser = async (user: Member) => {
      const existingChat = chats.value.find((chat) => chat.participants.includes(user.userId))
      // console.log('existingChat:', chats.value)
      if (existingChat) {
        console.log('existingChat:', existingChat)
        selectedChat.value = existingChat
        await selectChat(existingChat)
        toggleModal()
        return
      }
      const chatRoomRef = await addDoc(collection(db, 'chatRooms'), {
        participants: [currentUserId.value, user.userId],
        lastMessage: '',
        timestamp: serverTimestamp(),
      })

      selectChat({
        roomId: chatRoomRef.id,
        participants: [currentUserId.value, user.userId],
        lastMessage: '',
        timestamp: '',
        participant: {
          name: user.name,
          loginId: user.loginId,
          profileUrl: user.profileUrl,
        },
      })

      toggleModal()
    }

    const toggleModal = () => {
      isModalOpen.value = !isModalOpen.value
    }

    onMounted(async () => {
      await fetchMyId()
      fetchChatRooms()
    })

    return {
      chats,
      selectedChat,
      messages,
      searchQuery,
      newMessage,
      isModalOpen,
      searchLoginId,
      searchResults,
      currentUserId,
      filteredChats,
      selectChat,
      sendMessage,
      toggleModal,
      searchUser,
      startChatWithUser,
      fetchMyId,
      formatTimestamp,
    }
  },
})
</script>
