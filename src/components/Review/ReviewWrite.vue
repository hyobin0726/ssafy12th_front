<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-5 rounded-lg shadow-lg w-1/2 h-3/4 flex flex-col">
      <div class="flex justify-between items-center mb-4">
        <Back @click="closeModal" class="w-6 h-6" />
        <span class="text-xl">새 리뷰 작성</span>
        <button class="text-xl">다음</button>
      </div>

      <div class="flex justify-center items-center h-screen">
        <label
          v-if="previews.length === 0"
          for="inputFile"
          class="bg-[#A8B087] rounded-md px-4 py-2 font-semibold text-white"
        >
          사진 추가
        </label>
        <!-- 이미지 미리보기 (전체 영역을 채움) -->
        <div v-if="previews.length > 0" class="relative w-full h-full overflow-hidden rounded-md">
          <img
            v-for="(preview, index) in previews"
            :key="index"
            :src="preview"
            alt="미리보기 이미지"
            class="absolute inset-0 w-full h-full object-cover"
          />
          <label
            for="inputFile"
            class="absolute bottom-2 right-2 font-semibold p-4 rounded-2xl bg-[#A8B087] text-white"
          >
            사진 추가
          </label>
        </div>
      </div>

      <input
        type="file"
        id="inputFile"
        ref="fileInput"
        style="display: none"
        multiple
        @change="handleFileUpload"
        accept="image/*"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Back from '@/assets/Nav/Back.svg'

export default defineComponent({
  components: {
    Back,
  },
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['close'],
  methods: {
    closeModal() {
      this.$emit('close')
    },
  },
  setup() {
    const fileInput = ref<HTMLInputElement | null>(null)
    const previews = ref<string[]>([])

    // 파일 업로드 핸들러
    const handleFileUpload = (event: Event) => {
      const target = event.target as HTMLInputElement
      const files = target.files
      if (files) {
        Array.from(files).forEach((file) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            if (e.target && e.target.result) {
              previews.value.push(e.target.result as string) // 미리보기 배열에 이미지 추가
            }
          }
          reader.readAsDataURL(file) // 이미지 파일을 Data URL로 변환
        })
      }
    }

    return {
      fileInput,
      handleFileUpload,
      previews,
    }
  },
})
</script>

<style scoped>
/* 필요한 추가 스타일 */
</style>
