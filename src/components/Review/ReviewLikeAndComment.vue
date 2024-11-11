<template>
  <div class="flex items-center space-x-4">
    <div class="flex items-center space-x-2">
      <div @click="toggleLike">
        <component :is="isLiked ? 'FullHeart' : 'NonHeart'" class="w-6 h-6" />
      </div>
      <span class="text-xl">{{ likeCount }} 개</span>
    </div>
    <div class="flex items-center space-x-2">
      <Chat class="w-6 h-6" />
      <span class="text-xl">{{ review.comment_count }} 개</span>
    </div>
  </div>
  <div @click="toggleBookmark">
    <component :is="isBookmarked ? 'Bookmark' : 'NonBookmark'" class="w-6 h-6" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import axios from 'axios'
import type { PropType } from 'vue'
import type { Review } from '@/types/Review'
import NonHeart from '@/assets/Review/NonHeart.svg'
import Bookmark from '@/assets/Review/Bookmark.svg'
import NonBookmark from '@/assets/Review/NonBookmark.svg'
import Chat from '@/assets/Review/Chat.svg'
import FullHeart from '@/assets/Review/FullHeart.svg'

export default defineComponent({
  components: { NonHeart, Chat, Bookmark, FullHeart, NonBookmark },
  props: {
    review: {
      type: Object as PropType<Review>,
      required: true,
    },
  },
  setup(props) {
    const isLiked = ref(false)
    const isBookmarked = ref(false)
    const toggleLike = () => {
      isLiked.value = !isLiked.value
    }
    const toggleBookmark = () => {
      isBookmarked.value = !isBookmarked.value
    }
    // console.log(props.review, '??')
    const likeCount = ref(0)
    const fetchLikeCount = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/api/v1/reviews/love/${props.review.reviewId}`,
        )
        likeCount.value = response.data
      } catch (error) {
        console.error('좋아요 개수를 가져오는데 실패했습니다:', error)
      }
    }
    onMounted(() => {
      fetchLikeCount()
    })

    return { isLiked, toggleLike, isBookmarked, toggleBookmark, likeCount, fetchLikeCount }
  },
})
</script>

<style lang="scss" scoped></style>
