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
                type="text"
                placeholder="여행지를 검색해보세요"
                class="w-full px-4 py-1.5 rounded border border-gray-300 focus:outline-none focus:border-gray-400 text-sm"
              />
              <button class="absolute right-0 h-full px-4 bg-black text-white text-sm font-medium rounded-r">
                Search
              </button>
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

    <!-- Main Content -->
    <main class="pt-16">
      <!-- Hero Section -->
      <div class="relative h-[500px] w-full overflow-hidden">
        <img src="../../assets/Profile.png" alt="Travel Board" class="w-full h-full object-cover" />
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
            <img :src="review.image" :alt="review.title" class="w-full h-48 object-cover" />
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
import { defineComponent } from 'vue'
import Logo from '@/assets/logo.svg'

interface Review {
  title: string
  image: string
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
          image: `/src/assets/Profile.png`,
          distance: 350,
          walkTime: 5,
        },
        {
          title: '이삭 토스트 여수 전남대점',
          image: '/src/assets/Profile.png',
          distance: 500,
          walkTime: 7,
        },
        {
          title: '스타벅스 해운대점',
          image: '/src/assets/Profile.png',
          distance: 450,
          walkTime: 6,
        },
      ] as Review[],
    }
  },
})
</script>

<style>
/* Additional custom styles can be added here if needed */
</style>
