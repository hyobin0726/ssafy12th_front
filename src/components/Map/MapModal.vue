<template>
  <div class="flex h-full w-full bg-white">
    <div class="flex flex-col w-[300px] h-full p-4">
      <div class="mb-4">
        <div class="flex items-center gap-2">
          <input
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
        <div v-if="filteredPlaces.length > 0" class="space-y-2">
          <div
            v-for="place in filteredPlaces"
            :key="place.id"
            class="flex items-center gap-4 p-2 border rounded-md cursor-pointer hover:bg-gray-100"
            @click="selectPlace(place)"
          >
            <img :src="place.icon" alt="place" class="w-12 h-12 rounded-md" />
            <div>
              <h4 class="font-medium">{{ place.name }}</h4>
              <p class="text-sm text-gray-600">{{ place.category }}</p>
              <p class="text-sm text-gray-500">{{ place.address }}</p>
            </div>
          </div>
        </div>
        <p v-else class="text-sm text-gray-500">검색 결과가 없습니다.</p>
      </div>

      <!-- 선택된 장소 상세 정보 -->
      <div v-if="selectedPlace" class="mt-4 p-4 bg-gray-50 border rounded-md">
        <h2 class="text-lg font-semibold mb-2">{{ selectedPlace.name }}</h2>
        <p class="text-sm"><strong>카테고리:</strong> {{ selectedPlace.category }}</p>
        <p class="text-sm"><strong>주소:</strong> {{ selectedPlace.address }}</p>
        <p class="text-sm"><strong>설명:</strong> {{ selectedPlace.description }}</p>
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
import { ref, defineComponent } from 'vue'
import Attractions from '@/assets/Map/1.svg'
import Culture from '@/assets/Map/2.svg'
import Festivals from '@/assets/Map/3.svg'
import Courses from '@/assets/Map/4.svg'
import Leports from '@/assets/Map/5.svg'
import Accommodations from '@/assets/Map/6.svg'
import Shopping from '@/assets/Map/7.svg'
import Restaurants from '@/assets/Map/8.svg'
import Search from '@/assets/Map/search.svg'
export default defineComponent({
  components: { Search },
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
    const places = ref([
      {
        id: 1,
        name: '광주복집',
        category: '음식점',
        contentType: 39,
        address: '서울특별시 강서구 강서로 375-8',
        description: '맛있는 복요리 전문점',
        icon: 'https://pup-review-phinf.pstatic.net/MjAyNDA3MjBfMjEy/MDAxNzIxNDQ3MzkwOTU4.L4pKyeU3XpcfV-5BtQesq9lkVJHABCSF0tyF9hIETqQg.C2lbl78L3nE3RbMyj6B7A4rVrY4v_BPGLiKzSVtdDvQg.JPEG/C8DD015B-54AB-4D75-B684-C06033F2A9F3.jpeg?type=f912_608',
      },
      {
        id: 2,
        name: '한강공원',
        category: '문화시설',
        contentType: 14,
        address: '서울특별시 영등포구 여의동로',
        description: '서울 시민들의 쉼터',
        icon: '/assets/icons/park.png',
      },
    ])
    const filteredPlaces = ref<
      {
        id: number
        name: string
        category: string
        address: string
        description: string
        icon: string
        contentType: number
      }[]
    >([])
    const selectedPlace = ref<{
      id: number
      name: string
      category: string
      address: string
      description: string
      icon: string
      contentType: number
    } | null>(null)

    const selectCategory = (category: number) => {
      selectedCategory.value = category
      filterPlaces()
    }

    const search = () => {
      filterPlaces()
    }

    const filterPlaces = () => {
      filteredPlaces.value = places.value.filter(
        (place) =>
          place.contentType === selectedCategory.value &&
          (!selectedCategory.value || place.contentType === selectedCategory.value),
      )
    }

    const selectPlace = (place: any) => {
      selectedPlace.value = place
    }

    return {
      searchQuery,
      selectedCategory,
      options,
      places,
      filteredPlaces,
      selectedPlace,
      selectCategory,
      search,
      selectPlace,
    }
  },
})
</script>

<style scoped></style>
