<template>
  <div class="flex h-screen">
    <Nav class="w-1/4 h-screen" />
    <div class="w-3/4 overflow-y-scroll">
      <ReviewItem v-for="review in reviews" :key="review.review_id" :review="review" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ReviewItem from '@/components/Review/ReviewItem.vue'
import Nav from '@/components/common/Nav.vue'
import type { Review } from '@/types/Review'

export default defineComponent({
  components: { ReviewItem, Nav },
  setup() {
    const reviews = ref<Review[]>([
      {
        review_id: 1,
        content: '정말 좋아요!',
        point: 3.5,
        latitude: 37.5665,
        longitude: 126.978,
        created_at: new Date('2024-10-31T12:34:56'),
        image_url: [
          'https://i.pinimg.com/564x/95/6a/de/956ade4ba29c2351f66c6c9ea982aaa3.jpg',
          'https://i.pinimg.com/736x/03/57/fe/0357fe68523f7c5d76ea5c6fff3e24de.jpg',
        ],
        order_index: 0,
        title: '부산역',
        like_count: 10,
        liked: false,
        comment_count: 3,
        member: {
          login_id: 'hong',
          name: '홍길동',
          profile_url: 'https://i.pinimg.com/736x/03/57/fe/0357fe68523f7c5d76ea5c6fff3e24de.jpg',
        },
      },
      {
        review_id: 2,
        content: '가격 대비 만족합니다.',
        point: 4.5,
        latitude: 37.567,
        longitude: 126.979,
        created_at: new Date('2024-10-31T12:34:56'),
        image_url: ['https://i.pinimg.com/564x/95/6a/de/956ade4ba29c2351f66c6c9ea982aaa3.jpg'],
        order_index: 0,
        title: '구미역',
        like_count: 1000,
        liked: true,
        comment_count: 300,
        member: {
          login_id: 'park',
          name: '이순신',
          profile_url: 'https://i.pinimg.com/736x/03/57/fe/0357fe68523f7c5d76ea5c6fff3e24de.jpg',
        },
      },
    ])

    return { reviews }
  },
})
</script>
