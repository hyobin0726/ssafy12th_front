<template>
  <!-- Header -->
  <header class="w-full bg-white z-50 shadow-md">
    <div class="flex items-center justify-between px-6 py-3">
      <!-- Logo -->
      <div class="flex items-center space-x-2 mr-8">
        <img src="../../assets/logo.svg" alt="Logo" class="h-6 w-auto" />
      </div>

      <!-- Navigation -->
      <div class="flex items-center flex-1">
        <div class="flex items-center space-x-6 mr-6">
          <router-link to="/map">
            <span class="text-gray-700 hover:text-black text-sm font-medium">지도</span>
          </router-link>
          <router-link to="/crewPage">
            <button class="text-gray-700 hover:text-black text-sm font-medium">모임</button>
          </router-link>
          <router-link to="/chat">
            <button class="text-gray-700 hover:text-black text-sm font-medium">채팅</button>
          </router-link>
        </div>
        <!-- Search Bar -->
        <div class="relative flex items-center flex-1 max-w-[400px] mr-6">
          <input
            v-model="keyword"
            @input="onKeywordChange"
            type="text"
            placeholder="여행지를 검색해보세요"
            class="w-full px-4 py-1.5 rounded border border-gray-300 focus:outline-none focus:border-gray-400 text-sm"
          />
          <button
            @click="onSearchClick"
            class="absolute right-0 h-full px-4 bg-black text-white text-sm font-medium rounded-r"
          >
            Search
          </button>
          <!-- Dropdown for search suggestions -->
          <div
            v-if="suggestions.length > 0"
            class="absolute top-full left-0 w-full bg-white border border-gray-300 shadow-lg rounded mt-1 z-50 fade-in"
          >
            <ul>
              <li
                v-for="(suggestion, index) in suggestions"
                :key="index"
                @click="onSuggestionClick(suggestion)"
                class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                <span v-html="highlight(suggestion, keyword)"></span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Auth Buttons -->
        <div class="flex items-center space-x-4">
          <button class="px-4 py-1.5 bg-gray-600 text-white text-sm font-medium rounded hover:bg-gray-700">
            Login
          </button>
          <button class="px-4 py-1.5 bg-black text-white text-sm font-medium rounded hover:bg-gray-900">Sign</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import debounce from 'lodash/debounce'

interface Review {
  title: string
  imageUrls: string
  distance: number
  walkTime: number
}

export default defineComponent({
  emits: ['searchResults'],
  setup(_, { emit }) {
    const keyword = ref('')
    const suggestions = ref<string[]>([])
    const searchResults = ref<Review[]>([])
    const onSearchClick = async () => {
      if (keyword.value.trim()) {
        try {
          const { data } = await axios.get(
            `${import.meta.env.VITE_APP_BASE_URL}/api/v1/reviews/search?hashtagName=${keyword.value}`,
          )
          searchResults.value = data
          emit('searchResults', searchResults.value)
          // console.log('검색 결과:', searchResults.value) // 콘솔에서 데이터 확인
        } catch (error) {
          console.error('API 호출 오류:', error)
        }
      }
    }

    const { refetch } = useQuery({
      queryKey: ['searchResults', keyword],
      queryFn: () =>
        axios
          .get(`${import.meta.env.VITE_APP_BASE_URL}/api/v1/reviews/hashSearch?keyword=${keyword.value}`)
          .then((res) => {
            const data = res.data

            suggestions.value = data
            // console.log('검색 결과:', suggestions.value)
            return data
          }),
      enabled: false,
    })

    const onKeywordChange = debounce(() => {
      if (keyword.value.trim()) {
        refetch()
      } else {
        suggestions.value = []
      }
    }, 300)

    const onSuggestionClick = (suggestion: string) => {
      keyword.value = suggestion
      suggestions.value = []
    }

    // 검색어 하이라이트
    const highlight = (text: string, query: string) => {
      const regex = new RegExp(`(${query})`, 'gi')
      return text.replace(regex, '<span class="text-black font-bold">$1</span>')
    }

    return {
      keyword,
      suggestions,
      onKeywordChange,
      onSuggestionClick,
      highlight,
      onSearchClick,
      searchResults,
    }
  },
})
</script>

<style scoped>
/* CSS 애니메이션 정의 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes buttonPress {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(0.95);
  }
}

/* 헤더 슬라이드 효과 */
header {
  animation: fadeIn 0.5s ease-in-out;
}

/* 드롭다운 슬라이드 효과 */
.fade-in {
  animation: slideDown 0.3s ease-in-out;
}

/* 버튼 클릭 효과 */
button:active {
  animation: buttonPress 0.1s ease-in-out;
  transform: scale(0.95); /* 클릭 시 즉각 반응을 추가 */
}
</style>
