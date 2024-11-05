<template>
  <section>
    <swiper
      :pagination="{ clickable: true }"
      :navigation="{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }"
      class="w-full max-w-lg mb-4"
    >
      <swiper-slide v-for="(img, index) in imageUrls" :key="index">
        <img :src="img" :alt="`이미지 ${index + 1}`" class="h-[50vh] w-[50vh] max-w-full object-cover" />
      </swiper-slide>
      <!-- 커스텀 네비게이션 버튼 -->
      <div
        class="swiper-button-next text-orange-500 text-3xl absolute right-4 top-1/2 transform -translate-y-1/2 hover:text-orange-400 cursor-pointer"
      ></div>
      <div
        class="swiper-button-prev text-orange-500 text-3xl absolute left-4 top-1/2 transform -translate-y-1/2 hover:text-orange-400 cursor-pointer"
      ></div>
    </swiper>
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

export default defineComponent({
  components: { Swiper, SwiperSlide },
  props: {
    imageUrls: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped></style>
