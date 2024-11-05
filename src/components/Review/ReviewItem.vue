<template>
  <section class="p-5 flex flex-col items-center border-[1px]">
    <div class="flex items-center w-full mb-4 justify-between">
      <div class="flex">
        <img :src="review.member.profile_url" alt="Profile" class="w-12 h-12 rounded-full mr-2" />
        <div class="flex flex-col">
          <span>{{ review.member.login_id }}</span>
          <p>{{ formattedDate }}</p>
        </div>
      </div>
      <More class="w-6 h-6" />
    </div>

    <div class="p-2 flex justify-center mb-4">
      <ReviewImage :imageUrls="review.image_url" />
    </div>

    <div class="w-full flex mb-4 justify-between items-center">
      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-1">
          <NonHeart class="w-6 h-6" />
          <span>{{ review.like_count }} 개</span>
        </div>
        <div class="flex items-center space-x-1">
          <Chat class="w-6 h-6" />
          <span>{{ review.comment_count }} 개</span>
        </div>
      </div>
      <Bookmark class="w-6 h-6" />
    </div>

    <div class="flex w-full items-center mb-4">
      <Location class="h-6 mr-2" />
      <h2 class="mr-2">{{ review.title }}</h2>
      <span>별점: {{ review.point }}</span>
    </div>

    <div class="w-full mb-4">
      <p>{{ review.content }}</p>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import type { PropType } from 'vue'
import type { Review } from '@/types/Review'
import NonHeart from '@/assets/Review/NonHeart.svg'
import More from '@/assets/Review/More.svg'
import Chat from '@/assets/Review/Chat.svg'
import Bookmark from '@/assets/Review/Bookmark.svg'
import Location from '@/assets/Review/Location.svg'
import ReviewImage from '@/components/Review/ReviewImage.vue'

export default defineComponent({
  components: { NonHeart, More, Chat, Bookmark, Location, ReviewImage },
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
