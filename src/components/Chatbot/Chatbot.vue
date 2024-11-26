<template>
  <div>
    <!-- Floating Chat Button -->
    <button
      v-if="!isChatOpen"
      @click="toggleChatbot"
      class="fixed bottom-5 right-5 transform hover:scale-110 transition-all duration-300 group"
    >
      <div class="relative">
        <div
          class="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"
        ></div>
        <div class="relative px-6 py-6 bg-black rounded-full ring-1 ring-gray-900/5 leading-none flex items-center">
          <span class="text-white text-xl animate-bounce">💭</span>
        </div>
      </div>
    </button>

    <!-- Chat Window -->
    <div
      v-if="isChatOpen"
      class="fixed bottom-5 right-5 w-96 transform transition-all duration-500 ease-in-out"
      :class="{ 'translate-y-0 opacity-100': isChatOpen, 'translate-y-10 opacity-0': !isChatOpen }"
    >
      <div
        class="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-lg border border-gray-700/50"
      >
        <!-- Header -->
        <div class="relative bg-gradient-to-r from-purple-600 to-blue-500 p-4 flex justify-between items-center">
          <div class="flex items-center space-x-2">
            <span class="text-2xl animate-spin-slow">🌟</span>
            <h2 class="text-white font-semibold text-lg tracking-wide">AI 여행 도우미</h2>
          </div>
          <button @click="toggleChatbot" class="text-white hover:text-gray-200 transition-colors duration-300">
            <span class="text-2xl rotate-0 hover:rotate-90 transition-transform duration-300 inline-block">x</span>
          </button>
        </div>

        <!-- Chat Display -->
        <div
          ref="chatContainer"
          class="h-[400px] overflow-y-auto p-4 bg-opacity-75 backdrop-blur-sm scroll-smooth"
          style="background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1))"
        >
          <div
            v-for="(message, index) in messages"
            :key="index"
            :class="{ 'flex justify-end': message.isUser }"
            class="mb-4 animate-fade-in-up"
          >
            <div
              :class="[
                message.isUser
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                  : 'bg-gradient-to-r from-gray-800 to-gray-700 text-gray-100',
                'px-4 py-2 rounded-2xl shadow-lg max-w-[80%] transform transition-all duration-300 hover:scale-102',
              ]"
            >
              {{ message.text }}
            </div>
          </div>

          <!-- Loading Animation -->
          <div v-if="isLoading" class="flex justify-center items-center space-x-2 p-4">
            <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse-fast"></div>
            <div class="w-2 h-2 bg-purple-500 rounded-full animate-pulse-fast" style="animation-delay: 0.2s"></div>
            <div class="w-2 h-2 bg-pink-500 rounded-full animate-pulse-fast" style="animation-delay: 0.4s"></div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="p-4 bg-gray-900 border-t border-gray-700/50">
          <div class="flex items-center space-x-2">
            <input
              v-model="userInput"
              @keypress.enter="sendMessage"
              type="text"
              placeholder="질문을 입력하세요..."
              class="flex-1 bg-gray-800 text-gray-100 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 placeholder-gray-400"
            />
            <button
              @click="sendMessage"
              class="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transform hover:scale-105"
            >
              전송
            </button>
          </div>
        </div>
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
      const currentInput = userInput.value

      // 입력창 초기화
      userInput.value = ''

      // 메시지 추가 후 스크롤 이동
      scrollToBottom()

      // 로딩 시작
      isLoading.value = true

      try {
        // console.log(import.meta.env.VITE_GPT_API_KEY)
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: `
              당신은 30년 경력의 여행 전문가이자 여행 가이드입니다. 당신은 전 세계를 여행하며 수많은 여행객에게 여행지를 추천하고, 여행 경로를 설계하고, 유용한 여행 팁을 제공한 경험이 풍부합니다.

              당신의 목표는 사용자에게 맞춤형 여행 정보를 제공하고, 효율적이고 기억에 남는 여행을 계획할 수 있도록 돕는 것입니다. 여행 경로를 추천할 때는 사용자의 관심사, 여행 목적, 예산, 여행 스타일(예: 힐링, 모험, 맛집 탐방)을 고려하십시오. 여행지 추천 시 해당 장소의 독특한 매력, 활동, 먹거리, 문화적 특성을 강조하십시오.

              또한, 유용한 여행 팁(예: 짐 꾸리는 법, 현지 문화 이해, 비용 절약 방법)을 제공할 수 있으며, 사용자가 특정 장소에 대해 질문하면 깊이 있는 정보를 전달하십시오.

              답변 스타일은:
              1. 친절하고 전문적이며, 여행객의 궁금증을 해결하려 노력합니다.
              2. 간결하면서도 풍부한 정보를 제공합니다.
              3. 사용자가 여행을 상상할 수 있도록 생동감 있는 묘사를 포함합니다.

              예를 들어:
              - 여행지 추천: "서울에서는 한강 공원, 경복궁, 남산 타워를 추천드립니다. 특히 남산 타워에서는 서울의 아름다운 전경을 감상할 수 있습니다."
              - 여행 팁: "교통권을 절약하려면 평일 오전 출발을 고려하세요. 또한, 해당 지역 시장에서 간단한 식사를 해결하면 비용도 아끼고 현지 문화를 체험할 수 있습니다."

              
              `,
              },
              { role: 'user', content: currentInput },
            ],
            temperature: 0.7,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${import.meta.env.VITE_GPT_API_KEY}`,
            },
          },
        )

        const botReply = response.data.choices[0].message.content.trim()
        messages.value.push({ text: botReply, isUser: false })

        // 메시지 추가 후 스크롤 이동
        // scrollToBottom()
      } catch (error) {
        console.error('API 호출 실패:', (error as any).response?.data || (error as any).message)
        messages.value.push({ text: '죄송합니다. 요청을 처리할 수 없습니다.', isUser: false })
      } finally {
        isLoading.value = false //로딩 종료
        scrollToBottom() // 오류 메시지도 스크롤 이동
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

<style>
@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse-fast {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out forwards;
}

.animate-pulse-fast {
  animation: pulse-fast 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}

.hover\:scale-102:hover {
  transform: scale(1.02);
}
</style>
