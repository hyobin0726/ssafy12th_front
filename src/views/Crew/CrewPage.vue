<!-- CrewPage.vue -->
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

          <!-- 메뉴 드롭바 -->
          <div class="relative">
            <!-- 드롭다운 버튼 -->
            <button @click="toggleDropdown" class="px-4 py-2 bg-blue-500 text-white rounded-md">모임</button>

            <!-- 드롭다운 메뉴 -->
            <div v-if="isDropdownOpen" class="absolute mt-2 bg-white border rounded-md shadow-lg">
              <!-- 사용자가 가입한 모임 목록 -->
              <ul>
                <li v-for="crew in myCrews" :key="crew.crewId" class="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  {{ crew.name }}
                </li>
              </ul>

              <!-- 모임 생성 버튼 -->
              <div class="border-t">
                <button @click="onCrewCreated" class="w-full px-4 py-2 text-left hover:bg-gray-100">모임 생성</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 컴포넌트 안보이는 이슈 -->
    <CrewNewCreate :isOpen="isCrewModalOpen" @close="isCrewModalOpen = false" @created="onCrewCreated" />

    <!--ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ카카오맵ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ-->
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

<script lang="ts">
import { ref, onMounted, defineComponent } from 'vue'
import axios from 'axios'
import CrewNewCreate from '@/components/Crew/CrewNewCreate.vue'

//모달 생서위해추가
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'

export default defineComponent({
  components: {
    CrewNewCreate,
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionRoot,
    TransitionChild,
  },
  setup() {
    //모임 모달 관련
    //모임 모달 상태
    const isCrewModalOpen = ref(false)
    //모임 생성
    const channelName = ref('')
    const searchUser = ref('')
    const invitedUsers = ref<{ userId: number; loginId: string }[]>([])
    const searchError = ref('')
    // 드롭다운 상태 관리
    const isDropdownOpen = ref(false)
    const myCrews = ref<{ crewId: number; name: string }[]>([]) // 사용자의 모임 목록

    // 드롭다운 토글
    const toggleDropdown = () => {
      isDropdownOpen.value = !isDropdownOpen.value
    }

    // 사용자의 모임 목록 조회
    const fetchMyCrews = async () => {
      const accessToken = sessionStorage.getItem('accessToken') // 인증 토큰 가져오기
      if (!accessToken) {
        console.error('Access token is missing')
        return
      }

      try {
        const response = await axios.get('http://localhost:8080/api/v1/crew/myCrew', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        myCrews.value = response.data // 반환된 모임 목록 저장
      } catch (error) {
        console.error('Failed to fetch crews:', error)
      }
    }

    // 버튼 클릭 핸들러
    const handleCreateCrew = async () => {
      if (!channelName.value) return
      console.log('이게 ㄹㅇ 만드는거 크루')
      // 모임 생성 로직 추가

      console.log('모임 생성:', {
        name: channelName.value,
        invitedUsers: invitedUsers.value,
      })

      // API 요청에 필요한 데이터
      const requestBody = {
        name: channelName.value,
        users: invitedUsers.value,
      }

      // Access Token 가져오기
      const accessToken = sessionStorage.getItem('accessToken')
      if (!accessToken) {
        console.error('Access token is missing')
        return
      }

      try {
        // API 호출
        const response = await axios.post('http://localhost:8080/api/v1/crew/create', requestBody, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        console.log('Crew created successfully:', response.data)

        // 모달 닫고 다른 페이지로 이동
        closeModal()
      } catch (error) {
        console.error('Failed to create crew:', error)
      }
    }

    // 모임 모달 닫기
    const closeModal = () => {
      isCrewModalOpen.value = false
      channelName.value = ''
      searchUser.value = ''
      invitedUsers.value = []
      searchError.value = ''
    }

    // 사용자 검색
    const searchForUser = async () => {
      if (!searchUser.value) {
        searchError.value = '사용자 아이디를 입력하세요.'
        return
      }

      const accessToken = sessionStorage.getItem('accessToken')
      if (!accessToken) {
        console.error('Access token is missing')
        searchError.value = '로그인 상태를 확인해주세요.'
        return
      }

      try {
        // API 호출
        const response = await axios.get(`http://localhost:8080/api/v1/member/search?loginId=${searchUser.value}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        const userData = response.data

        // invitedUsers 배열에 사용자 추가
        invitedUsers.value.push({ userId: userData.userId, loginId: userData.loginId })
        searchUser.value = '' // 입력 필드 초기화
        searchError.value = '' // 에러 메시지 초기화
      } catch (error) {
        console.error('사용자 검색 실패:', error)
        searchError.value = '사용자를 찾을 수 없습니다. 다시 시도해주세요.'
      }
    }

    const onCrewCreated = () => {
      console.log('모임 생성 버튼 클릭')
      isCrewModalOpen.value = true
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

    // 맵관련ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
    // 지도 및 폴리곤 관련 상태
    const kakaoMap = ref<kakao.maps.Map | undefined>(undefined)
    const polygons = ref<kakao.maps.Polygon[]>([])
    const detailMode = ref(false)

    // 맵 모달 상태
    const isModalOpen = ref(false)
    const selectedRegion = ref<{ sido: string; sigungu: string; sigkornm: string } | null>(null)

    // 지도 초기화
    const initializeMap = () => {
      const mapContainer = document.getElementById('map')
      if (!mapContainer) return

      kakaoMap.value = new kakao.maps.Map(mapContainer, {
        center: new kakao.maps.LatLng(37.566826, 126.9786567), // 서울 중심 좌표
        level: 12,
      })

      kakao.maps.event.addListener(kakaoMap.value, 'zoom_changed', handleZoomChange)

      loadPolygons('sido.json') // 초기 시도 폴리곤 로드
    }

    // 줌 변경 이벤트 핸들러
    const handleZoomChange = () => {
      if (!kakaoMap.value) return

      const level = kakaoMap.value.getLevel()
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
          const path = feature.geometry.coordinates[0].map(
            (coord: number[]) => new kakao.maps.LatLng(coord[1], coord[0]),
          )

          const polygon = new kakao.maps.Polygon({
            map: kakaoMap.value,
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
      fetchMyCrews()
    })

    return {
      isCrewModalOpen,

      //모임위한것들
      channelName,
      searchUser,
      searchForUser,
      searchError,
      invitedUsers,

      //모임 드롭바관련
      toggleDropdown,
      myCrews,

      isDropdownOpen,
      handleCreateCrew,
      closeModal,
      onCrewCreated,
      CrewNewCreate,

      handleViewCrew,
      handleLeaveCrew,
      isModalOpen,
      selectedRegion,
    }
  },
})
</script>

<style scoped>
/* 필요한 스타일 */
</style>
