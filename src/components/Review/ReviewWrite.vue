<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-5 rounded-lg shadow-lg w-1/2 h-3/4 flex flex-col">
      <div class="flex justify-between items-center mb-4">
        <Back @click="closeModal" class="w-6 h-6" />
        <span class="text-xl">새 리뷰 작성</span>
        <button class="text-xl" @click="submitImage">다음</button>
      </div>

      <div class="flex justify-center items-center h-screen">
        <label
          v-if="previews.length === 0"
          for="inputFile"
          class="bg-[#A8B087] rounded-md px-4 py-2 font-semibold text-white"
        >
          사진 추가
        </label>
        <Swiper
          v-if="previews.length > 0"
          class="relative w-full h-full overflow-hidden rounded-md"
          :slidesPerView="1"
          :loop="true"
          :navigation="previews.length > 1 ? navigationOptions : false"
        >
          <SwiperSlide v-for="(preview, index) in previews" :key="index">
            <img :src="preview" alt="미리보기 이미지" class="absolute inset-0 w-full h-full object-cover" />
            <button
              class="absolute top-1 right-1 bg-red-500 text-white w-7 h-7 rounded-full flex justify-center items-center"
              @click="removeImage(index)"
            >
              x
            </button>
            <label
              for="inputFile"
              class="absolute bottom-2 right-2 font-semibold p-4 rounded-2xl bg-[#A8B087] text-white"
            >
              사진 추가
            </label>
          </SwiperSlide>
          <div v-if="previews.length > 1" class="swiper-button-next text-[#DAB692]"></div>
          <div v-if="previews.length > 1" class="swiper-button-prev text-[#DAB692]"></div>
        </Swiper>
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
    <ReviewWriteContent :isOpen="isNextModalOpen" :imageUrls="uploadedUrls" @close="isNextModalOpen = false" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Back from '@/assets/Nav/Back.svg'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import ReveiewWriteContent from './ReveiewWriteContent.vue'
export default defineComponent({
  name: 'ImageUploader',
  components: {
    Back,
    Swiper,
    SwiperSlide,
    ReveiewWriteContent,
  },
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['close', 'submitImages'],

  setup(props, { emit }) {
    const isNextModalOpen = ref(false)
    const navigationOptions: any = { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }
    const fileInput = ref<HTMLInputElement | null>(null)
    const previews = ref<string[]>([])
    const uploadedUrls = ref<string[]>([])
    // S3 클라이언트 설정
    const s3Client = new S3Client({
      region: import.meta.env.VITE_AWS_S3_REGION,
      credentials: {
        accessKeyId: import.meta.env.VITE_AWS_S3_ACCESS_KEY,
        secretAccessKey: import.meta.env.VITE_AWS_S3_SECRET_KEY,
      },
    })
    // 파일을 S3에 업로드하는 함수
    const uploadImageToS3 = async (file: File): Promise<string | null> => {
      const fileName = `image_${Date.now()}_${file.name}`
      const command = new PutObjectCommand({
        Bucket: import.meta.env.VITE_AWS_S3_BUCKET_NAME,
        Key: fileName,
        Body: file,
        ContentType: file.type,
      })

      try {
        // console.log('업로드 시작:', command)
        const response = await s3Client.send(command)
        // console.log('업로드 성공:', response)
        return `https://${import.meta.env.VITE_AWS_S3_BUCKET_NAME}.s3.${import.meta.env.VITE_AWS_S3_REGION}.amazonaws.com/${fileName}`
      } catch (error) {
        console.error('S3 업로드 오류:', error)
        return null
      }
    }
    // 파일 업로드 및 미리보기 처리 함수
    const handleFileUpload = async (event: Event) => {
      const target = event.target as HTMLInputElement
      const files = target.files
      if (files) {
        const fileArray = Array.from(files)
        for (const file of fileArray) {
          const s3Url = await uploadImageToS3(file)
          if (s3Url) {
            uploadedUrls.value.push(s3Url) // S3 URL 저장
            const reader = new FileReader()
            reader.onload = (e) => {
              if (e.target && e.target.result) {
                previews.value.push(e.target.result as string)
              }
            }
            reader.readAsDataURL(file)
          }
        }
      }
    }

    const removeImage = (index: number) => {
      previews.value.splice(index, 1)
      uploadedUrls.value.splice(index, 1)
    }
    const submitImage = () => {
      emit('submitImages', uploadedUrls.value)
      isNextModalOpen.value = true
      console.log('이미지 업로드 완료:', uploadedUrls.value)
    }
    const closeModal = () => {
      emit('close')
      previews.value = []
      uploadedUrls.value = []
    }

    return {
      fileInput,
      closeModal,
      handleFileUpload,
      previews,
      navigationOptions,
      removeImage,
      submitImage,
      isNextModalOpen,
      uploadedUrls,
    }
  },
})
</script>

<style scoped>
/* 필요한 추가 스타일 */
</style>
