<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="fixed top-0 w-full bg-white border-b border-gray-200 z-50">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center">
          <!-- Logo -->
          <div class="flex items-center space-x-2 mr-8">
            <img src="../../assets/logo.svg" alt="Logo" class="h-6 w-auto" />
            <span class="font-bold text-lg">TRAVEL</span>
          </div>

          <!-- Navigation -->
          <div class="flex items-center flex-1">
            <div class="flex items-center space-x-6 mr-6">
              <button class="text-gray-700 hover:text-black text-sm font-medium">둘러보기</button>
              <button class="text-gray-700 hover:text-black text-sm font-medium">Map</button>
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
              <button class="px-4 py-1.5 bg-black text-white text-sm font-medium rounded hover:bg-gray-900">
                Sign
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
    <reviewSearch :reviews="searchResults" />
    <!-- Main Content -->
    <main class="pt-16">
      <!-- Hero Section -->
      <div class="relative h-[500px] w-full overflow-hidden">
        <img
          src="https://i.pinimg.com/control2/736x/4d/64/3b/4d643b99e3e3aa7f23d3f00a2f809c9e.jpg"
          alt="Travel Board"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Popular Destinations -->
      <section class="container mx-auto px-4 py-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">요즘 많이 찾는 여행지</h2>
          <button class="text-blue-600 hover:text-blue-700">전체보기 →</button>
        </div>

        <!-- Review Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="(review, index) in reviews" :key="index" class="rounded-lg overflow-hidden shadow-lg">
            <img
              src="https://i.pinimg.com/originals/7a/f2/e6/7af2e61abc8d92d035b1be43367ccb5b.gif"
              alt="review.title"
              class="w-full h-48 object-cover"
            />
            <!-- <Logo alt="Saved Image" class="w-full h-40 object-cover rounded-md mb-2" /> -->
            <div class="p-4">
              <h3 class="font-bold text-lg mb-2">{{ review.title }}</h3>
              <div class="text-sm text-gray-600">
                <p>{{ review.distance }}m • 도보 {{ review.walkTime }}분</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import debounce from 'lodash/debounce'
import ReviewSearch from '../../components/Review/ReviewSearch.vue'
interface Review {
  title: string
  imageUrls: string
  distance: number
  walkTime: number
}

export default defineComponent({
  name: 'Search',
  data() {
    return {
      reviews: [
        {
          title: '스타벅스 명지점',
          imageUrls: `/src/assets/Profile.png`,
          distance: 350,
          walkTime: 5,
        },
        {
          title: '이삭 토스트 여수 전남대점',
          imageUrls: '/src/assets/Profile.png',
          distance: 500,
          walkTime: 7,
        },
        {
          title: '스타벅스 해운대점',
          imageUrls: '/src/assets/Profile.png',
          distance: 450,
          walkTime: 6,
        },
      ] as Review[],
    }
  },
  components: {
    ReviewSearch,
  },
  setup() {
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
          console.log('검색 결과:', searchResults.value) // 콘솔에서 데이터 확인
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

.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
</style>
