<template>
  <div class="flex">
    <img :src="review.member.profile_url" alt="Profile" class="w-12 h-12 rounded-full mr-2" />
    <div class="flex flex-col">
      <span class="font-bold">{{ review.member.login_id }}</span>
      <p>{{ formattedDate }}</p>
    </div>
  </div>
  <More class="w-8 h-8" @click="isModalOpen = true" />
  <ReviewModal :isVisible="isModalOpen" @close="isModalOpen = false" />
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import type { PropType } from 'vue'
import type { Review } from '@/types/Review'
import More from '@/assets/Review/More.svg'
import ReviewModal from '@/components/Review/ReviewModal.vue'
export default defineComponent({
  components: { More, ReviewModal },
  props: {
    review: {
      type: Object as PropType<Review>,
      required: true,
    },
  },
  setup(props) {
    const isModalOpen = ref(false)

    const formattedDate = computed(() => {
      const date = props.review.created_at
      return (
        date.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }) +
        ' ' +
        date.toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        })
      )
    })
    // console.log(isModalOpen)
    return { formattedDate, isModalOpen }
  },
})
</script>

<style lang="scss" scoped></style>
