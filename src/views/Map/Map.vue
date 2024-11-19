<template>
  <div class="flex h-full w-full">
    <KakaoMap
      :lat="mapStore.lat"
      :lng="mapStore.lng"
      :width="'100%'"
      :height="'100vh'"
      :scrollwheel="false"
      v-if="loaded"
    >
      <div class="w-[450px] fixed z-[10] p-5 h-full flex flex-col">
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

        <div class="mt-4 flex-grow overflow-y-auto bg-white rounded-lg flex flex-col scrollbar-hide">
          <div class="p-3 space-y-2">
            <div v-if="area.length > 0">
              <div
                v-for="(item, index) in area"
                :key="index"
                class="flex items-center p-2 border rounded-md cursor-pointer hover:bg-gray-100 mb-2"
                @click="searchByRegion(item.areaCode, null)"
              >
                <Location class="w-6 h-6 mr-2" />
                <p>{{ item.title }} 로 검색하시겠습니까?</p>
              </div>
            </div>

            <div v-if="sigungu.length > 0">
              <div
                v-for="(item, index) in sigungu"
                :key="index"
                class="flex items-center p-2 border rounded-md cursor-pointer hover:bg-gray-100 mb-2"
                @click="searchByRegion(item.areaCode, item.siGunGuCode)"
              >
                <Location class="w-6 h-6 mr-2" />
                <p>{{ item.title }} 로 검색하시겠습니까?</p>
              </div>
            </div>
          </div>

          <p v-if="check" class="text-sm text-gray-500 p-3">검색 결과가 없습니다.</p>
          <MapModal class="h-full" :map="filteredPlaces" />
        </div>
      </div>
      <KakaoMapMarker
        :lat="currentPosition.lat"
        :lng="currentPosition.lng"
        :image="{
          imageSrc: 'https://dangnagi-buket.s3.ap-northeast-2.amazonaws.com/image_1731910823267_Location.svg',
          imageWidth: 35,
          imageHeight: 35,
        }"
      />
      <KakaoMapMarker
        v-for="(place, index) in filteredPlaces"
        :key="index"
        :lat="place.latitude"
        :lng="place.longitude"
        :image="{
          imageSrc: 'https://dangnagi-buket.s3.ap-northeast-2.amazonaws.com/Vector.svg',
          imageWidth: 35,
          imageHeight: 35,
        }"
        :infoWindow="{
          content: `<div style='padding:6px; font-size:14px; color:#333;'>${place.title}</div>`,
        }"
      />
      <button
        class="fixed left-[50%] top-[5%] bg-[#A8B087] text-white p-2 rounded z-[9] bg-opacity-70"
        style="round: 10px"
        @click="searchCurrentArea"
      >
        이 지역에서 검색
      </button>
    </KakaoMap>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted } from 'vue'
import axios from 'axios'
import { KakaoMap, KakaoMapMarker } from 'vue3-kakao-maps'
import Search from '@/assets/Map/search.svg'
import { useMapStore } from '@/stores/Map'
import MapModal from '@/components/Map/MapModal.vue'
import type { Map } from '@/types/Map'
import type { area } from '@/types/Map'
import type { sigungu } from '@/types/Map'
import AlterImg from '@/assets/Map/AlterImg.jpg'
import Location from '@/assets/Map/Location.svg'
export default defineComponent({
  components: {
    Search,
    KakaoMap,
    KakaoMapMarker,
    MapModal,
    Location,
  },
  setup() {
    const mapStore = useMapStore()
    const searchQuery = ref('')
    const loaded = ref(false)
    const filteredPlaces = ref<Map[]>([])
    const area = ref<area[]>([])
    const sigungu = ref<sigungu[]>([])
    const check = ref(true)
    const currentPosition = ref({
      lat: 37.566826,
      lng: 126.9786567,
    })
    const search = async () => {
      if (!searchQuery.value.trim()) {
        console.warn('검색어를 입력해주세요.')
        return
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/v1/map/search/title`, {
          params: { title: searchQuery.value },
        })

        const attractions = response.data.attractions || []
        const areaData = response.data.area || []
        const sigunguData = response.data.sigungu || []
        filteredPlaces.value = attractions.map((place: any) => ({
          ...place,
          Image: place.firstImage1 ? place.firstImage1 : AlterImg,
        }))

        if (filteredPlaces.value.length > 0) {
          const lat = filteredPlaces.value[0].latitude
          const lng = filteredPlaces.value[0].longitude
          mapStore.setCoordinates(lat, lng)
        }

        area.value = areaData
        sigungu.value = sigunguData

        // 검색 결과가 없는 경우
        check.value = !(areaData.length || sigunguData.length || filteredPlaces.value.length)
      } catch (error) {
        console.error('검색 중 오류가 발생했습니다:', error)
        filteredPlaces.value = []
        area.value = []
        sigungu.value = []
        check.value = true
      }
    }

    // const searchCurrentArea = () => {
    //   console.log('현재 중심에서 검색:', {
    //     lat: mapStore.lat,
    //     lng: mapStore.lng,
    //   })
    //   // 현재 중심에서의 검색 API 호출 추가 가능
    // }
    const searchByRegion = async (areaCode: number, siGunGuCode: number | null) => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/v1/map/search/region`, {
          params: { areaCode, siGunGuCode },
        })
        // console.log(response.data)

        const attractions = response.data || []
        filteredPlaces.value = attractions.map((place: any) => ({
          ...place,
          Image: place.firstImage1 ? place.firstImage1 : AlterImg,
        }))

        if (filteredPlaces.value.length > 0) {
          const lat = filteredPlaces.value[0].latitude
          const lng = filteredPlaces.value[0].longitude
          mapStore.setCoordinates(lat, lng)
        }

        check.value = !filteredPlaces.value.length
      } catch (error) {
        console.error('지역 검색 중 오류가 발생했습니다:', error)
        filteredPlaces.value = []
        check.value = true
      }
    }

    const searchCurrentArea = () => {
      console.log('현재 중심에서 검색:', {
        lat: mapStore.lat,
        lng: mapStore.lng,
      })
    }
    onMounted(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            currentPosition.value = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }
            mapStore.setCoordinates(position.coords.latitude, position.coords.longitude)
            loaded.value = true
          },
          (error) => {
            console.error('위치 정보를 가져오는 데 실패했습니다:', error)
            loaded.value = true // 오류 발생 시에도 지도 표시
          },
        )
      } else {
        console.error('Geolocation을 지원하지 않는 브라우저입니다.')
        loaded.value = true
      }
    })

    return {
      currentPosition,
      searchQuery,
      filteredPlaces,
      mapStore,
      loaded,
      search,
      searchCurrentArea,
      area,
      sigungu,
      check,
      searchByRegion,
    }
  },
})
</script>

<style scoped>
/* 스크롤바 숨기기 */
.scrollbar-hide {
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
</style>
