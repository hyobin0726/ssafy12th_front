<template>
  <div class="flex h-full w-full bg-white">
    <!-- 검색 입력 -->
    <div class="flex flex-col w-[350px] h-full p-4">
      <div class="mb-4">
        <div class="flex items-center gap-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="검색어를 입력하세요"
            class="flex-grow p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#A8B087]"
          />
          <button @click="search" class="bg-[#A8B087] p-2 rounded-md hover:bg-[#BCC199] flex justify-items-center">
            <Search class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- 검색 결과 -->
      <div class="flex-grow overflow-y-auto">
        <div v-if="computedPlaces.length > 0" class="space-y-2">
          <div
            v-for="place in computedPlaces"
            :key="place.attractionId"
            class="flex flex-col p-2 border rounded-md cursor-pointer hover:bg-gray-100"
          >
            <div class="flex justify-center">
              <img :src="place.Image" alt="place" class="w-72 h-56 rounded-md" />
            </div>
            <div class="mt-3">
              <div class="flex items-end">
                <h4 class="text-lg">
                  {{ place.title.length > 9 ? place.title.slice(0, 9) + '...' : place.title }}
                </h4>
                <p class="text-sm text-gray-600 ml-1">{{ getOptionName(place.contentTypeId) }}</p>
                <div class="flex items-center ml-3">
                  <FullStar class="w-4 h-4" />
                  <span>4.8</span>
                </div>
              </div>
              <p class="text-sm text-gray-500 mt-1">{{ place.addr1 }}</p>
            </div>
          </div>
        </div>
        <p v-else class="text-sm text-gray-500">검색 결과가 없습니다.</p>
      </div>
    </div>

    <div class="flex flex-col items-center justify-start gap-4 w-16 bg-white shadow-lg p-2">
      <button
        v-for="(option, index) in options"
        :key="index"
        :class="[
          'flex flex-col items-center gap-1 p-2 rounded-2xl text-sm w-14',
          selectedCategory === option.contentType ? 'bg-[#F9E9DA] text-slate-500 ' : 'bg-gray-100 text-gray-700',
          'hover:bg-blue-200',
        ]"
        @click="selectCategory(option.contentType)"
      >
        <component :is="option.icon" class="w-8 h-8" />
        <span class="text-xs text-center whitespace-nowrap">{{ option.name }}</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, defineComponent } from 'vue'
import axios from 'axios'
import type { Map } from '@/types/Map'
import Attractions from '@/assets/Map/1.svg'
import Culture from '@/assets/Map/2.svg'
import Festivals from '@/assets/Map/3.svg'
import Courses from '@/assets/Map/4.svg'
import Leports from '@/assets/Map/5.svg'
import Accommodations from '@/assets/Map/6.svg'
import Shopping from '@/assets/Map/7.svg'
import Restaurants from '@/assets/Map/8.svg'
import Search from '@/assets/Map/search.svg'
import FullStar from '@/assets/Review/FullStar.svg'
import AlterImg from '@/assets/Map/AlterImg.jpg'

export default defineComponent({
  components: {
    Search,
    FullStar,
    Attractions,
    Culture,
    Festivals,
    Courses,
    Leports,
    Accommodations,
    Shopping,
    Restaurants,
  },
  setup() {
    const searchQuery = ref('')
    const selectedCategory = ref(0)
    const options = ref([
      { name: '관광지', icon: Attractions, contentType: 12 },
      { name: '문화시설', icon: Culture, contentType: 14 },
      { name: '축제', icon: Festivals, contentType: 15 },
      { name: '여행코스', icon: Courses, contentType: 25 },
      { name: '레포츠', icon: Leports, contentType: 28 },
      { name: '숙박', icon: Accommodations, contentType: 32 },
      { name: '쇼핑', icon: Shopping, contentType: 38 },
      { name: '음식점', icon: Restaurants, contentType: 39 },
    ])
    const filteredPlaces = ref<Map[]>([])

    const computedPlaces = computed(() =>
      filteredPlaces.value.map((place) => ({
        ...place,
        Image:
          place.firstImage1 && typeof place.firstImage1 === 'string' && place.firstImage1.trim() !== ''
            ? place.firstImage1
            : AlterImg,
      })),
    )

    const getOptionName = (contentTypeId: number): string => {
      const option = options.value.find((opt) => opt.contentType === contentTypeId)
      return option ? option.name : '기타'
    }

    const search = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/v1/map/search/title`, {
          params: { title: searchQuery.value },
        })
        filteredPlaces.value = response.data
        // console.log('검색 결과:', filteredPlaces.value)
      } catch (error) {
        console.error('검색 중 오류가 발생했습니다:', error)
        filteredPlaces.value = []
      }
    }

    const selectCategory = (category: number) => {
      selectedCategory.value = category
      filterPlaces()
    }

    const filterPlaces = () => {
      if (selectedCategory.value === 0) {
        return
      }
      filteredPlaces.value = filteredPlaces.value.filter((place) => place.contentTypeId === selectedCategory.value)
    }

    return {
      searchQuery,
      selectedCategory,
      options,
      computedPlaces,
      getOptionName,
      search,
      selectCategory,
    }
  },
})
</script>

<style scoped></style>
