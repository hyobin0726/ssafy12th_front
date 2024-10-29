<template>
  <div>리뷰 페이지</div>

  <section class="p-5">
    <div class="space-y-5">
      <div class="flex space-x-5 items-center">
        <img src="@/assets/logo.jpg" alt="샘플 프로필사진" class="rounded-full w-12 h-12" />
        <div>사용자 아이디</div>
        <div>작성 시간</div>
      </div>
      <img src="@/assets/logo.jpg" alt="샘플 게시글 사진" />
      <div class="flex justify-between">
        <Heart />
        <div>북마크</div>
      </div>
      <div>장소 및 별점</div>
      <div>내용입니다.</div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Heart from '@/assets/Review/Heart.svg'

export default defineComponent({
  name: 'ReviewList',
  components: {
    Heart,
  },
})
</script>

<style lang="scss" scoped></style>
