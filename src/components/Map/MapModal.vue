<template>
  <div class="flex w-full">
    <div class="flex-grow overflow-y-auto p-3">
      <div v-if="filteredPlaces.length > 0" class="space-y-2">
        <div
          v-for="place in filteredPlaces"
          :key="place.attractionId"
          class="flex flex-col p-2 border rounded-md cursor-pointer hover:bg-gray-100"
          @click="openDetail(place)"
        >
          <div class="flex justify-center">
            <img :src="place.Image" alt="place" class="w-72 h-56 rounded-md" />
          </div>
          <div class="mt-3">
            <div class="flex justify-between">
              <div class="flex items-end">
                <h4 class="text-lg">
                  {{ place.title.length > 9 ? place.title.slice(0, 9) + '...' : place.title }}
                </h4>
                <p class="text-sm text-gray-600 ml-2">{{ getOptionName(place.contentTypeId) }}</p>
                <div class="flex items-center ml-3">
                  <FullStar class="w-4 h-4" />
                  <span>4.8</span>
                </div>
              </div>
              <NonBookMark class="w-5 h-5" />
            </div>
            <p class="text-sm text-gray-500 mt-1">{{ place.addr1 }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 카테고리 필터 버튼 -->
    <div class="flex flex-col items-center justify-start gap-4 w-16 shadow-lg p-2">
      <button
        v-for="(option, index) in options"
        :key="index"
        :class="[
          'flex flex-col items-center gap-1 p-2 rounded-2xl text-sm w-14',
          selectedCategory === option.contentType
            ? 'bg-[#A8B087] bg-opacity-70 text-slate-500 '
            : 'bg-gray-100 text-gray-700',
          'hover:bg-[#A8B087] hover:bg-opacity-50',
        ]"
        @click="toggleCategory(option.contentType)"
      >
        <component :is="option.icon" class="w-8 h-8" />
        <span class="text-xs text-center whitespace-nowrap">{{ option.name }}</span>
      </button>
    </div>
    <AttractionDetail v-if="isModalOpen && selectedPlace" :place="selectedPlace" @close="isModalOpen = false" />
  </div>
</template>

<script lang="ts">
import { ref, computed, defineComponent, markRaw } from 'vue'
import FullStar from '@/assets/Review/FullStar.svg'
import AlterImg from '@/assets/Map/AlterImg.jpg'
import Attractions from '@/assets/Map/1.svg'
import Culture from '@/assets/Map/2.svg'
import Festivals from '@/assets/Map/3.svg'
import Courses from '@/assets/Map/4.svg'
import Leports from '@/assets/Map/5.svg'
import Accommodations from '@/assets/Map/6.svg'
import Shopping from '@/assets/Map/7.svg'
import Restaurants from '@/assets/Map/8.svg'
import type { Map } from '@/types/Map'
import AttractionDetail from './AttractionDetail.vue'
import { useMapStore } from '@/stores/Map'
import NonBookMark from '@/assets/Review/NonBookMark.svg'
export default defineComponent({
  components: {
    FullStar,
    NonBookMark,
    AttractionDetail,
  },
  props: {
    map: {
      type: Array as () => Map[],
      required: true,
    },
  },
  setup(props) {
    const isModalOpen = ref(false)
    const selectedPlace = ref<Map | null>(null)
    const selectedCategory = ref(0)
    const mapStore = useMapStore()
    const options = ref([
      { name: '관광지', icon: markRaw(Attractions), contentType: 12 },
      { name: '문화시설', icon: markRaw(Culture), contentType: 14 },
      { name: '축제', icon: markRaw(Festivals), contentType: 15 },
      { name: '여행코스', icon: markRaw(Courses), contentType: 25 },
      { name: '레포츠', icon: markRaw(Leports), contentType: 28 },
      { name: '숙박', icon: markRaw(Accommodations), contentType: 32 },
      { name: '쇼핑', icon: markRaw(Shopping), contentType: 38 },
      { name: '음식점', icon: markRaw(Restaurants), contentType: 39 },
    ])

    const filteredPlaces = computed(() => {
      if (selectedCategory.value === 0) {
        return props.map.map((place) => ({
          ...place,
          Image: place.firstImage1 ? place.firstImage1 : AlterImg,
        }))
      }
      return props.map
        .filter((place) => place.contentTypeId === selectedCategory.value)
        .map((place) => ({
          ...place,
          Image: place.firstImage1 ? place.firstImage1 : AlterImg,
        }))
    })

    const getOptionName = (contentTypeId: number): string => {
      const option = options.value.find((opt) => opt.contentType === contentTypeId)
      return option ? option.name : '기타'
    }

    const toggleCategory = (category: number) => {
      if (selectedCategory.value === category) {
        selectedCategory.value = 0
      } else {
        selectedCategory.value = category
      }
    }
    const openDetail = (place: Map) => {
      selectedPlace.value = place
      isModalOpen.value = true
      // 선택한 지역에 맞게 useMapStore의 위도와 경도 업데이트
      mapStore.setCoordinates(place.latitude, place.longitude)
    }

    return {
      options,
      filteredPlaces,
      getOptionName,
      toggleCategory,
      selectedCategory,
      isModalOpen,
      selectedPlace,
      openDetail,
    }
  },
})
</script>

<style scoped></style>
