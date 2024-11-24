<template>
  <div class="weather-widget bg-white shadow-lg rounded-lg p-4 w-[250px]">
    <div class="header flex justify-between items-center mb-4">
      <div class="location text-lg font-medium">{{ weatherData?.name }}</div>
      <div class="temperature text-2xl font-bold">{{ weatherData?.main?.temp }}°C</div>
    </div>
    <div class="description flex items-center gap-2 text-gray-600">
      <img
        v-if="weatherData?.weather[0]?.icon"
        :src="`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`"
        alt="weather-icon"
        class="w-10 h-10"
      />
      <p class="capitalize">{{ weatherData?.weather[0]?.description }}</p>
    </div>
    <div class="details mt-4 text-sm text-gray-500">
      <p>최저: {{ weatherData?.main?.temp_min }}°C / 최고: {{ weatherData?.main?.temp_max }}°C</p>
      <p>습도: {{ weatherData?.main?.humidity }}%</p>
      <p>풍속: {{ weatherData?.wind?.speed }} m/s</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue'
import axios from 'axios'

export default defineComponent({
  name: 'Weather',
  props: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const weatherData = ref<any | null>(null)

    const fetchWeather = async () => {
      try {
        const apiKey = `${import.meta.env.VITE_OPENWEATHER_API_KEY}`
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${props.lat}&lon=${props.lng}&units=metric&lang=kr&appid=${apiKey}`,
        )
        weatherData.value = response.data
      } catch (error) {
        console.error('날씨 정보를 가져오는 중 오류 발생:', error)
      }
    }
    watch(
      () => [props.lat, props.lng],
      () => {
        fetchWeather()
      },
    )
    onMounted(() => {
      fetchWeather()
    })

    return {
      weatherData,
    }
  },
})
</script>

<style scoped></style>
