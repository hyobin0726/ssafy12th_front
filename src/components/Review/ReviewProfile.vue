<template>
  <div class="flex">
    <img :src="profileImageUrl" alt="Profile" class="w-12 h-12 rounded-full mr-2" />
    <div class="flex flex-col">
      <span class="font-bold">{{ profile?.loginId }}</span>
      <p>{{ formattedDate }}</p>
    </div>
  </div>
  <More class="w-8 h-8" @click="isModalOpen = true" />
  <ReviewModal :isVisible="isModalOpen" @close="isModalOpen = false" :review="review" />
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue'
import type { PropType } from 'vue'
import type { Member } from '@/types/Member'
import type { Review } from '@/types/Review'
import More from '@/assets/Review/More.svg'
import ReviewModal from '@/components/Review/ReviewModal.vue'
import axios from 'axios'
import ProfileImage from '@/assets/Profile.png'
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
    // console.log(typeof props.review.createdAt)
    // console.log(props.member.loginId)
    const formattedDate = computed(() => {
      const date = new Date(props.review.createdAt)
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
    const profile = ref<Member>()
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/v1/member/${props.review.userId}`)
        profile.value = response.data
        // console.log('프로필 데이터를 가져왔습니다:', profile.value)
      } catch (error) {
        console.error('리뷰 데이터를 가져오는데 실패했습니다:', error)
      }
    }
    onMounted(() => {
      fetchProfile()
    })
    const profileImageUrl = computed(() => {
      return profile.value?.profileUrl || ProfileImage
    })

    return { formattedDate, isModalOpen, profile, fetchProfile, profileImageUrl, ProfileImage }
  },
})
</script>

<style lang="scss" scoped></style>
