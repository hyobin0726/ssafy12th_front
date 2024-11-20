<!-- KoreaMap.vue -->
<template>
  <div class="h-screen flex flex-col">
    <!-- 심플한 헤더 -->
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
            <button class="text-gray-700 hover:text-black text-sm font-medium">둘러보기</button>
            <button class="text-gray-700 hover:text-black text-sm font-medium">Map</button>
          </div>

          <!-- Search Bar -->
          <div class="relative flex items-center flex-1 max-w-[400px] mr-6">
            <input
              type="text"
              placeholder="여행지를 검색해보세요"
              class="w-full px-4 py-1.5 rounded border border-gray-300 focus:outline-none focus:border-gray-400 text-sm"
            />
            <button class="absolute right-0 h-full px-4 bg-black text-white text-sm font-medium rounded-r">
              Search
            </button>
          </div>

          <!-- Dropdown Menu -->
          <div class="relative">
            <button
              @click="isDropdownOpen = !isDropdownOpen"
              class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700"
            >
              Menu
            </button>

            <div
              v-if="isDropdownOpen"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1"
            >
              <button
                @click="handleCreateCrew"
                class="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
              >
                모임 생성
              </button>
              <button @click="handleViewCrew" class="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">
                내 모임 조회
              </button>
              <button @click="handleLeaveCrew" class="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">
                모임 나가기
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 카카오맵 -->
    <div class="flex-1" id="map" style="width: 100%; height: calc(100vh - 64px)"></div>
    <!-- Modal Toggle Button -->
    <button
      class="fixed top-20 left-5 bg-green-500 text-white p-3 rounded-full shadow-lg z-50"
      @click="isModalOpen = !isModalOpen"
    >
      {{ isModalOpen ? '모달 닫기' : '모달 열기' }}
    </button>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed top-20 left-16 bg-white shadow-md border rounded-lg w-80 z-50 p-4">
      <h2 class="text-xl font-bold mb-2">선택된 지역 정보</h2>
      <div v-if="selectedRegion">
        <p class="text-gray-800 font-medium">시도: {{ selectedRegion.sido }}</p>
        <p class="text-gray-800 font-medium">시군구: {{ selectedRegion.sigungu }}</p>
        <p class="text-gray-800 font-medium">이름: {{ selectedRegion.sigkornm }}</p>
      </div>
      <p v-else class="text-gray-500">아직 지역을 선택하지 않았습니다.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

// 지도 및 폴리곤 관련 상태
const map = ref<kakao.maps.Map | null>(null)
const polygons = ref<kakao.maps.Polygon[]>([])
const detailMode = ref(false)

// 모달 상태
const isModalOpen = ref(false)
const selectedRegion = ref<{ sido: string; sigungu: string; sigkornm: string } | null>(null)

// 드롭다운 상태 관리
const isDropdownOpen = ref(false)

// 버튼 클릭 핸들러
const handleCreateCrew = () => {
  console.log('모임 생성 버튼 클릭')
  // 모임 생성 로직 추가
}

const handleViewCrew = () => {
  console.log('내 모임 조회 버튼 클릭')
  // 내 모임 조회 로직 추가
}

const handleLeaveCrew = () => {
  console.log('모임 나가기 버튼 클릭')
  // 모임 나가기 로직 추가
}

// 지도 초기화
const initializeMap = () => {
  const mapContainer = document.getElementById('map')
  if (!mapContainer) return

  map.value = new kakao.maps.Map(mapContainer, {
    center: new kakao.maps.LatLng(37.566826, 126.9786567), // 서울 중심 좌표
    level: 12,
  })

  kakao.maps.event.addListener(map.value, 'zoom_changed', handleZoomChange)

  loadPolygons('sido.json') // 초기 시도 폴리곤 로드
}

// 줌 변경 이벤트 핸들러
const handleZoomChange = () => {
  if (!map.value) return

  const level = map.value.getLevel()
  if (detailMode.value && level > 10) {
    detailMode.value = false
    clearPolygons()
    loadPolygons('sido.json')
  } else if (!detailMode.value && level <= 10) {
    detailMode.value = true
    clearPolygons()
    loadPolygons('sigungu.json')
  }
}

// 폴리곤 데이터 로드
const loadPolygons = async (url: string) => {
  try {
    const response = await axios.get(`/${url}`) // JSON 파일 경로 수정
    const features = response.data.features

    features.forEach((feature: any) => {
      const path = feature.geometry.coordinates[0].map((coord: number[]) => new kakao.maps.LatLng(coord[1], coord[0]))

      const polygon = new kakao.maps.Polygon({
        map: map.value,
        path: path,
        strokeWeight: 2,
        strokeColor: '#004c80',
        strokeOpacity: 0.8,
        fillColor: '#fff',
        fillOpacity: 0.7,
      })

      polygons.value.push(polygon)

      kakao.maps.event.addListener(polygon, 'mouseover', () => {
        polygon.setOptions({ fillColor: '#09f' })
      })

      kakao.maps.event.addListener(polygon, 'mouseout', () => {
        polygon.setOptions({ fillColor: '#fff' })
      })

      // 클릭 이벤트: 선택한 지역 정보를 저장
      kakao.maps.event.addListener(polygon, 'click', () => {
        console.log(feature.properties)
        selectedRegion.value = {
          sido: feature.properties.CTP_ENG_NM || 'N/A',
          sigungu: feature.properties.SIG_ENG_NM || 'N/A',
          sigkornm: feature.properties.SIG_KOR_NM || 'N/A',
        }
        isModalOpen.value = true
      })
    })
  } catch (error) {
    console.error('폴리곤 데이터 로드 실패:', error)
  }
}

// 폴리곤 제거
const clearPolygons = () => {
  polygons.value.forEach((polygon) => polygon.setMap(null))
  polygons.value = []
}

// 컴포넌트 마운트 시 초기화
onMounted(() => {
  initializeMap()
})
</script>

<style scoped>
/* 필요한 스타일 */
</style>
