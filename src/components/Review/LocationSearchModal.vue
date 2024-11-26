<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white w-[80%] h-[80%] rounded-lg shadow-lg flex flex-col">
      <header class="p-4 border-b flex justify-between items-center">
        <h2 class="text-lg font-bold">위치 검색</h2>
        <button @click="$emit('close')" class="text-lg">닫기</button>
      </header>
      <div class="flex flex-col w-full p-5">
        <div class="flex items-center gap-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="검색어를 입력하세요"
            class="flex-grow p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#A8B087]"
            @keyup.enter="search"
          />
          <button @click="search" class="bg-[#A8B087] p-2 rounded-md hover:bg-[#BCC199] flex justify-items-center">
            <Search class="w-6 h-6" />
          </button>
        </div>

        <div
          v-if="searchResults.length"
          class="mt-4 bg-white rounded-lg space-y-3 p-4 overflow-y-auto search-results-scroll"
        >
          <div
            v-for="(result, index) in searchResults"
            :key="index"
            class="p-2 border rounded-md cursor-pointer hover:bg-gray-100"
            @click="selectResult(result)"
          >
            <p class="text-gray-700">{{ result.title }}</p>
          </div>
        </div>

        <p v-else-if="!searchResults.length && searchPerformed" class="text-sm text-gray-500 p-3">
          검색 결과가 없습니다.
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
import axios from 'axios'
import Search from '@/assets/Map/search.svg'
import type { Map } from '@/types/Map'
import { useToast } from 'vue-toast-notification'
export default defineComponent({
  components: {
    Search,
  },
  emits: ['select', 'close'],
  setup(_, { emit }) {
    const searchQuery = ref('')
    const searchResults = ref<Map[]>([])
    const searchPerformed = ref(false)
    const toast = useToast()
    const search = async () => {
      const query = searchQuery.value.trim()
      if (!query) {
        toast.error('검색어를 입력해주세요.')
        return
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/v1/map/search/title`, {
          params: { title: query },
        })

        searchResults.value = response.data.attractions || []
        searchPerformed.value = true
      } catch (error) {
        console.error('검색 중 오류가 발생했습니다:', error)
        searchResults.value = []
        searchPerformed.value = true
      }
    }

    const selectResult = (result: any) => {
      emit('select', result)
    }

    return {
      searchQuery,
      searchResults,
      searchPerformed,
      search,
      selectResult,
    }
  },
})
</script>

<style scoped>
/* 검색 결과에 스크롤 추가 */
.search-results-scroll {
  max-height: 580px; /* 고정 높이 */
  overflow-y: auto; /* 세로 스크롤 활성화 */
}

/* 스크롤바 숨기기 (선택사항) */
.search-results-scroll::-webkit-scrollbar {
  width: 6px; /* 스크롤바 너비 */
}
.search-results-scroll::-webkit-scrollbar-thumb {
  background-color: #a8b087; /* 스크롤바 색상 */
  border-radius: 3px; /* 스크롤바 둥글기 */
}
.search-results-scroll::-webkit-scrollbar-track {
  background: #f0f0f0; /* 스크롤바 트랙 색상 */
}
</style>
