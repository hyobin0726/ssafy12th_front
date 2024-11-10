<template>
  <section>
    <swiper
      :slidesPerView="1"
      :loop="true"
      :pagination="paginationOptions"
      :navigation="imageUrls.length > 1 ? navigationOptions : false"
      :modules="modules"
      class="w-full max-w-lg mb-4"
    >
      <swiper-slide v-for="(img, index) in imageUrls" :key="index">
        <img :src="img" :alt="`이미지 ${index + 1}`" class="max-h-[80vh] w-full object-cover" />
      </swiper-slide>
      <div v-if="imageUrls.length > 1" class="swiper-button-next text-[#DAB692]"></div>
      <div v-if="imageUrls.length > 1" class="swiper-button-prev text-[#DAB692]"></div>
    </swiper>
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { Pagination } from 'swiper/modules'

export default defineComponent({
  components: { Swiper, SwiperSlide },
  setup() {
    const modules = [Pagination]
    const paginationOptions: any = {
      clickable: true,
    }
    const navigationOptions: any = { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }

    return { modules, paginationOptions, navigationOptions }
  },
  props: {
    imageUrls: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped></style>
