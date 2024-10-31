<template>
  <section class="p-5 flex flex-col items-center border-[2px]">
    <div class="flex items-center w-full mb-4">
      <img :src="review.member.profile_url" alt="Profile" class="w-12 h-12 rounded-full mr-2" />
      <div class="flex flex-col">
        <span>{{ review.member.login_id }}</span>
        <p>{{ formattedDate }}</p>
      </div>
    </div>

    <div class="p-2 flex justify-center mb-4">
      <img :src="review.image_url" alt="Review" />
    </div>

    <div class="w-full text-left mb-4">
      <span>좋아요: {{ review.like_count }} 개</span>
      <span class="ml-4">댓글: {{ review.comment_count }} 개</span>
    </div>

    <div class="flex w-full text-left items-center mb-4">
      <h2 class="mr-2">{{ review.title }}</h2>
      <span>별점: {{ review.point }}</span>
    </div>

    <div class="w-full text-left">
      <p>{{ review.content }}</p>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import type { PropType } from 'vue'
import type { Review } from '@/types/Review'

export default defineComponent({
  props: {
    review: {
      type: Object as PropType<Review>,
      required: true,
    },
  },
  setup(props) {
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

    return { formattedDate }
  },
})
</script>
