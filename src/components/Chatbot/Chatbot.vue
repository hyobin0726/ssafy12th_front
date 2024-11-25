<template>
  <div>
    <button
      v-if="!isChatOpen"
      @click="toggleChatbot"
      class="fixed bottom-5 right-5 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600"
    >
      💬
    </button>

    <div v-if="isChatOpen" class="fixed bottom-5 right-5 w-96 h-[500px] bg-white rounded-lg shadow-lg flex flex-col">
      <!-- Header -->
      <div class="flex justify-between items-center bg-blue-500 text-white p-3 rounded-t-lg">
        <h2 class="text-lg font-semibold">AI 여행 도우미🐴</h2>
        <button @click="toggleChatbot" class="text-lg hover:text-gray-300">✖</button>
      </div>

      <!-- Chat Display -->
      <div ref="chatContainer" class="flex-1 overflow-y-auto p-3 border-b relative">
        <!-- 메시지 리스트 -->
        <div v-for="(message, index) in messages" :key="index" :class="{ 'text-right': message.isUser }">
          <div
            :class="message.isUser ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'"
            class="inline-block px-4 py-2 rounded-lg mb-2"
          >
            {{ message.text }}
          </div>
        </div>

        <!-- 로딩 표시 -->
        <div v-if="isLoading" class="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <img src="https://i.gifer.com/ZZ5H.gif" alt="로딩 중" class="w-12 h-12" />
        </div>
      </div>

      <!-- Input Area -->
      <div class="flex items-center p-2">
        <input
          v-model="userInput"
          @keypress.enter="sendMessage"
          type="text"
          placeholder="질문을 입력하세요..."
          class="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button @click="sendMessage" class="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600">
          전송
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue'
import axios from 'axios'

export default defineComponent({
  name: 'Chatbot',
  setup() {
    const isChatOpen = ref(false)
    const messages = ref<{ text: string; isUser: boolean }[]>([])
    const userInput = ref('')
    const isLoading = ref(false)
    const chatContainer = ref<HTMLDivElement | null>(null)

    const toggleChatbot = () => {
      isChatOpen.value = !isChatOpen.value
    }

    // 자동 스크롤: 메시지 추가 시마다 맨 아래로 이동
    const scrollToBottom = () => {
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight
      }
    }

    const sendMessage = async () => {
      if (!userInput.value.trim()) return

      // 사용자 메시지 추가
      messages.value.push({ text: userInput.value, isUser: true })

      // 입력창 초기화
      userInput.value = ''

      // 메시지 추가 후 스크롤 이동
      scrollToBottom()

      // 로딩 시작
      isLoading.value = true

      try {
        // GPT Chat Completions API 호출
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: '당신은 여행 도우미입니다. 사용자 질문에 여행 정보를 제공합니다.' },
              { role: 'user', content: messages.value[messages.value.length - 1].text },
            ],
            temperature: 0.7,
          },
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_GPT_API_KEY}`,
            },
          },
        )

        // OpenAI의 응답에서 메시지 내용 추출
        const botReply = response.data.choices[0].message.content.trim()
        messages.value.push({ text: botReply, isUser: false })

        // 메시지 추가 후 스크롤 이동
        scrollToBottom()
      } catch (error) {
        console.error('API 호출 실패:', (error as any).response?.data || (error as any).message)
        messages.value.push({ text: '죄송합니다. 요청을 처리할 수 없습니다.', isUser: false })

        // 오류 메시지도 스크롤 이동
        scrollToBottom()
      } finally {
        // 로딩 종료
        isLoading.value = false
      }
    }

    // 메시지가 추가될 때마다 스크롤 이동 감지
    watch(messages, scrollToBottom, { deep: true })

    return {
      isChatOpen,
      messages,
      userInput,
      isLoading,
      chatContainer,
      toggleChatbot,
      sendMessage,
    }
  },
})
</script>
