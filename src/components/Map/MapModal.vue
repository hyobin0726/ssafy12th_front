<template>
  <div class="bg-white w-[300px] h-[850px] p-4 flex flex-col">
    <h2 class="text-lg font-bold mb-4">장소 검색</h2>

    <!-- 카테고리 선택 -->
    <label for="category-select" class="text-sm font-semibold mb-2">카테고리 선택</label>
    <select id="category-select" v-model="selectedCategory" class="w-full border p-2 mb-4">
      <option disabled value="">카테고리 선택</option>
      <option v-for="category in categories" :key="category" :value="category">
        {{ category }}
      </option>
    </select>

    <!-- 장소 검색 -->
    <label for="search" class="text-sm font-semibold mb-2">장소 검색</label>
    <div class="flex mb-4">
      <input id="search" v-model="searchQuery" type="text" placeholder="검색어 입력" class="flex-grow border p-2" />
      <button @click="searchPlaces" class="bg-blue-500 text-white p-2 ml-2">검색</button>
    </div>

    <!-- 검색 결과 -->
    <div class="flex-grow overflow-y-auto border p-2">
      <h3 class="text-sm font-semibold mb-2">검색 결과</h3>
      <ul v-if="filteredPlaces.length > 0">
        <li
          v-for="place in filteredPlaces"
          :key="place.id"
          @click="selectPlace(place)"
          class="p-2 border-b cursor-pointer hover:bg-gray-100"
        >
          {{ place.name }} ({{ place.category }})
        </li>
      </ul>
      <p v-else class="text-sm text-gray-500">검색 결과가 없습니다.</p>
    </div>

    <!-- 선택된 장소 정보 -->
    <div v-if="selectedPlace" class="mt-4 p-4 border-t">
      <h3 class="text-lg font-semibold mb-2">선택된 장소</h3>
      <p><strong>이름:</strong> {{ selectedPlace.name }}</p>
      <p><strong>주소:</strong> {{ selectedPlace.address }}</p>
      <p><strong>카테고리:</strong> {{ selectedPlace.category }}</p>
      <p><strong>설명:</strong> {{ selectedPlace.description }}</p>
    </div>
  </div>
</template>
<script lang="ts">
import { ref } from 'vue'

// 장소 데이터 타입 정의
interface Place {
  id: number
  name: string
  address: string
  category: string
  description: string
}

export default {
  setup() {
    // 카테고리 데이터
    const categories = ref<string[]>(['음식점', '카페', '공원', '쇼핑몰', '기타'])

    // 선택된 카테고리와 검색어
    const selectedCategory = ref<string>('')
    const searchQuery = ref<string>('')

    // 장소 데이터 (더미 데이터)
    const places = ref<Place[]>([
      { id: 1, name: '서울역', address: '서울 중구 봉래동', category: '기타', description: '서울의 중심 역' },
      { id: 2, name: '광안리 해변', address: '부산 수영구', category: '공원', description: '부산의 아름다운 해변' },
      {
        id: 3,
        name: '스타벅스 강남점',
        address: '서울 강남구',
        category: '카페',
        description: '강남에 위치한 스타벅스',
      },
      { id: 4, name: '롯데백화점', address: '서울 소공동', category: '쇼핑몰', description: '서울의 대표적인 백화점' },
      { id: 5, name: '한강공원', address: '서울 영등포구', category: '공원', description: '서울 시민들의 쉼터' },
      {
        id: 6,
        name: '삼겹살집',
        address: '서울 마포구',
        category: '음식점',
        description: '맛있는 삼겹살을 먹을 수 있는 곳',
      },
    ])

    // 검색 결과 및 선택된 장소
    const filteredPlaces = ref<Place[]>([])
    const selectedPlace = ref<Place | null>(null)

    // 장소 검색
    const searchPlaces = () => {
      filteredPlaces.value = places.value.filter((place) => {
        const matchesSearch = place.name.includes(searchQuery.value)
        const matchesCategory = !selectedCategory.value || place.category === selectedCategory.value
        return matchesSearch && matchesCategory
      })
    }

    // 장소 선택
    const selectPlace = (place: Place) => {
      selectedPlace.value = place
    }

    return {
      categories,
      selectedCategory,
      searchQuery,
      places,
      filteredPlaces,
      selectedPlace,
      searchPlaces,
      selectPlace,
    }
  },
}
</script>
