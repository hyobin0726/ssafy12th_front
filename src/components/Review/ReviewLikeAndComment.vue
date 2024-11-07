<template>
  <div class="flex items-center space-x-4">
    <div class="flex items-center space-x-2">
      <div @click="toggleLike">
        <component :is="isLiked ? 'FullHeart' : 'NonHeart'" class="w-6 h-6" />
      </div>
      <span class="text-xl">{{ review.like_count }} 개</span>
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
import { defineComponent, ref } from 'vue'
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
  setup() {
    const isLiked = ref(false)
    const isBookmarked = ref(false)
    const toggleLike = () => {
      isLiked.value = !isLiked.value
    }
    const toggleBookmark = () => {
      isBookmarked.value = !isBookmarked.value
    }
    return { isLiked, toggleLike, isBookmarked, toggleBookmark }
  },
})
</script>

<style lang="scss" scoped></style>
