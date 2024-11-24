<template>
  <span>{{ point }}</span>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import type { PropType } from 'vue'
import axios from 'axios'
import type { Map } from '@/types/Map'
export default defineComponent({
  props: {
    place: {
      type: Object as PropType<Map>,
      required: true,
    },
  },
  setup(props) {
    const point = ref(0)
    const fetchMarkStatus = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/v1/reviews/average-point`, {
          params: {
            attractionId: props.place.attractionId,
          },
        })
        point.value = response.data
        // console.log('별점을 가져왔습니다:', point)
      } catch (error) {
        console.error('별점을 가져오는데 실패했습니다:', error)
      }
    }

    onMounted(() => {
      fetchMarkStatus()
    })

    return {
      point,
    }
  },
})
</script>

<style lang="scss" scoped></style>
