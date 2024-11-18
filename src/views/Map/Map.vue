<template>
  <KakaoMap :lat="lat" :lng="lng" :width="'100%'" :height="'100vh'" v-if="loaded" @center_changed="handleCenterChanged">
    <div class="fixed z-50 p-5 h-full">
      <MapModal />
    </div>
    <KakaoMapMarker
      v-if="loaded"
      :lat="lat"
      :lng="lng"
      :image="{
        imageSrc: 'https://dangnagi-buket.s3.ap-northeast-2.amazonaws.com/image_1731910823267_Location.svg',
        imageWidth: 35,
        imageHeight: 35,
      }"
    />
    <button
      class="fixed left-[50%] top-[5%] bg-[#A8B087] text-white p-2 rounded z-49 bg-opacity-70"
      @click="searchCurrentArea"
    >
      이 지역에서 검색
    </button>
  </KakaoMap>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from 'vue'
import { KakaoMap, KakaoMapMarker } from 'vue3-kakao-maps'
import MapModal from '@/components/Map/MapModal.vue'

export default defineComponent({
  components: { KakaoMap, KakaoMapMarker, MapModal },
  setup() {
    const lat = ref(37.566826) // 기본 위도
    const lng = ref(126.9786567) // 기본 경도
    const loaded = ref(false)
    const currentCenter = ref({ lat: 37.566826, lng: 126.9786567 }) // 현재 중심 좌표

    // 사용자의 현재 위치를 가져오는 함수
    onMounted(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            lat.value = position.coords.latitude
            lng.value = position.coords.longitude
            currentCenter.value = { lat: lat.value, lng: lng.value }
            loaded.value = true
          },
          (error) => {
            console.error('위치 정보를 가져오는 데 실패했습니다:', error)
            loaded.value = true // 오류 발생 시에도 기본 위치를 보여줌
          },
        )
      } else {
        console.error('Geolocation을 지원하지 않는 브라우저입니다.')
        loaded.value = true
      }
    })

    // 지도 중심이 변경될 때 호출되는 함수
    const handleCenterChanged = (mapInstance: any) => {
      const center = mapInstance.getCenter()
      currentCenter.value = { lat: center.getLat(), lng: center.getLng() }
      console.log('새 중심 좌표:', currentCenter.value)
    }

    // 현재 지역에서 검색 버튼 클릭 시 실행
    const searchCurrentArea = () => {
      console.log('현재 중심에서 검색:', currentCenter.value)
      // 검색 로직 추가 (예: API 호출)
    }

    return { lat, lng, loaded, handleCenterChanged, searchCurrentArea }
  },
})
</script>

<style scoped></style>
