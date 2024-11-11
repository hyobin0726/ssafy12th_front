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
    //좋아요 상태
    const token = sessionStorage.getItem('accessToken')
    const fetchLikeStatus = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/api/v1/reviews/love/${props.review.reviewId}/check`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        isLiked.value = response.data
        // console.log(isLiked.value)
      } catch (error) {
        console.error('좋아요 상태를 가져오는데 실패했습니다:', error)
      }
    }
    const toggleLike = () => {
      try {
        if (isLiked.value) {
          axios.delete(`${import.meta.env.VITE_APP_BASE_URL}/api/v1/reviews/love/${props.review.reviewId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          isLiked.value = false
          likeCount.value--
        } else {
          axios.post(
            `${import.meta.env.VITE_APP_BASE_URL}/api/v1/reviews/love/${props.review.reviewId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          isLiked.value = true
          likeCount.value++
        }
      } catch (error) {
        console.error('좋아요 상태를 변경하는데 실패했습니다:', error)
      }
    }
    //북마크 상태
    const fetchBookmarkStatus = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/api/v1/reviews/bookmark/${props.review.reviewId}/check`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        isBookmarked.value = response.data
      } catch (error) {
        console.error('북마크 상태를 가져오는데 실패했습니다:', error)
      }
    }
    const toggleBookmark = () => {
      try {
        if (isBookmarked.value) {
          axios.delete(`${import.meta.env.VITE_APP_BASE_URL}/api/v1/reviews/bookmark/${props.review.reviewId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          isBookmarked.value = false
        } else {
          axios.post(
            `${import.meta.env.VITE_APP_BASE_URL}/api/v1/reviews/bookmark/${props.review.reviewId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          isBookmarked.value = true
        }
      } catch (error) {
        console.error('북마크 상태를 변경하는데 실패했습니다:', error)
      }
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
      fetchLikeStatus()
      fetchBookmarkStatus()
    })

    return {
      isLiked,
      toggleLike,
      isBookmarked,
      toggleBookmark,
      likeCount,
      fetchLikeCount,
      fetchLikeStatus,
      token,
      fetchBookmarkStatus,
    }
  },
})
</script>

<style lang="scss" scoped></style>
