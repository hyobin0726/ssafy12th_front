<template>
  <div class="flex">
    <img :src="profileImageUrl" alt="Profile" class="w-12 h-12 rounded-full mr-2" />
    <div class="flex flex-col justify-center">
      <p class="text-sm font-semibold">{{ profile?.loginId }}</p>
      <p class="text-xs text-gray-500">{{ formattedDate }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue'
import type { PropType } from 'vue'
import type { Member } from '@/types/Member'
import type { Review } from '@/types/Review'
import axios from 'axios'
import ProfileImage from '@/assets/Profile.png'

export default defineComponent({
  props: {
    review: {
      type: Object as PropType<Review>,
      required: true,
    },
  },
  setup(props) {
    const token = sessionStorage.getItem('accessToken')
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

    return { formattedDate, profile, fetchProfile, profileImageUrl, ProfileImage, token }
  },
})
</script>

<style lang="scss" scoped></style>
