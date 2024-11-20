<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-5 rounded-lg shadow-lg w-3/4 h-3/4 flex flex-col">
      <div class="flex justify-between items-center mb-4">
        <Back @click="closeModal" class="w-6 h-6" />
        <span class="text-xl">새 리뷰 작성</span>
        <button class="text-xl" @click="submitReview">업로드</button>
      </div>
      <div class="flex h-full">
        <div class="flex justify-center items-center w-1/2">
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
                class="absolute top-1 right-1 bg-red-400 text-white w-6 h-6 rounded-full flex justify-center items-center"
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
        <div class="w-1/2 p-5 space-y-4">
          <div class="flex items-center space-x-2">
            <span v-for="n in 5" :key="n" @click="setRating(n)" class="cursor-pointer">
              <component :is="n <= form.rating ? 'FullStar' : 'EmptyStar'" class="w-6 h-6" />
            </span>
          </div>
          <p v-if="formErrors.rating" class="text-red-500 text-sm">{{ formErrors.rating }}</p>

          <textarea
            placeholder="해당 장소의 리뷰를 작성해주세요."
            class="w-full h-52 p-3 border rounded-md outline-none resize-none focus:border-[#A8B087]"
            maxlength="1000"
            v-model="form.content"
          />

          <div class="space-y-2">
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(hashTag, index) in form.hashTags"
                :key="index"
                class="bg-[#A8B087] text-white px-3 py-1 rounded-full flex items-center space-x-2"
              >
                <span>#{{ hashTag }}</span>
                <button @click="removeHashTag(index)" class="text-white text-xs">x</button>
              </span>
            </div>
            <input
              type="text"
              placeholder="#해시태그를 등록해보세요."
              v-model="inputHashTag"
              @keyup.enter="addHashTag"
              @keyup.space="addHashTag"
              class="w-full h-12 p-3 border rounded-md outline-none focus:border-[#A8B087]"
              :disabled="form.hashTags.length >= 5"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="위치 추가"
              class="w-full h-12 p-3 border rounded-md outline-none focus:border-[#A8B087] cursor-pointer"
              readonly
              v-model="form.location"
              @click="openLocationModal"
            />
          </div>
          <p v-if="formErrors.location" class="text-red-500 text-sm">{{ formErrors.location }}</p>
          <select class="w-full p-3 border rounded-md outline-none focus:border-[#A8B087]" v-model="form.visibility">
            <option value="0">전체공개</option>
            <option v-for="crew in crews" :key="crew.crewId" :value="crew.crewId">{{ crew.name }}</option>
          </select>
          <p v-if="formErrors.visibility" class="text-red-500 text-sm">{{ formErrors.visibility }}</p>
        </div>
      </div>
    </div>
    <LocationSearchModal v-if="isLocationModalVisible" @close="closeLocationModal" @select="setLocation" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import axios from 'axios'
import Back from '@/assets/Nav/Back.svg'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import FullStar from '@/assets/Review/FullStar.svg'
import EmptyStar from '@/assets/Review/EmptyStar.svg'
import type { Crew } from '@/types/Crew'
import LocationSearchModal from '@/components/Review/LocationSearchModal.vue'
import type { Map } from '@/types/Map'

export default defineComponent({
  name: 'ImageUploader',
  components: {
    Back,
    Swiper,
    SwiperSlide,
    FullStar,
    EmptyStar,
    LocationSearchModal,
  },
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['close', 'submitImages'],

  setup(props, { emit }) {
    const navigationOptions: any = { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }
    const fileInput = ref<HTMLInputElement | null>(null)
    const previews = ref<string[]>([])
    const uploadedUrls = ref<string[]>([])
    const isLocationModalVisible = ref(false)
    const openLocationModal = () => {
      isLocationModalVisible.value = true
    }
    const closeLocationModal = () => {
      isLocationModalVisible.value = false
    }
    const setLocation = (location: any) => {
      form.value.location = location.title
      form.value.attractionId = location.attractionId
      form.value.gugunId = location.siGunGuCode
      form.value.gugunSidoId = location.areaCode
      // console.log('선택한 위치:', location)
      closeLocationModal()
    }

    const form = ref({
      content: '',
      hashTags: [] as string[],
      location: '',
      visibility: 0,
      rating: 0,
      title: '',
      attractionId: null,
      gugunId: null,
      gugunSidoId: null,
    })

    const formErrors = ref({
      rating: '',
      image: '',
      location: '',
      visibility: '',
    })

    const inputHashTag = ref('')
    const validateForm = () => {
      formErrors.value.rating = form.value.rating > 0 ? '' : '별점을 선택해주세요.'
      formErrors.value.image = previews.value.length > 0 ? '' : '한 장 이상 이미지를 추가해 주세요.'
      formErrors.value.location = form.value.location && form.value.location.length > 0 ? '' : '위치를 선택해주세요.'
      formErrors.value.visibility = form.value.visibility > 0 ? '' : '공개 범위를 선택해주세요.'
      // console.log(formErrors.value.image)
      // console.log(formErrors.value.location)
      if (previews.value.length === 0) {
        alert(formErrors.value.image)
      }
      return (
        formErrors.value.rating === '' &&
        formErrors.value.image === '' &&
        formErrors.value.location === '' &&
        formErrors.value.visibility === ''
      )
    }

    const setRating = (value: number) => {
      form.value.rating = value
    }
    const addHashTag = () => {
      const tag = inputHashTag.value.trim()
      if (tag && !form.value.hashTags.includes(tag) && form.value.hashTags.length < 5) {
        form.value.hashTags.push(tag)
      }
      inputHashTag.value = ''
    }

    const removeHashTag = (index: number) => {
      form.value.hashTags.splice(index, 1)
    }

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
    // console.log(
    //   'uploadedUrls:',
    //   uploadedUrls.value.map((url) => url),
    // )
    const removeImage = (index: number) => {
      previews.value.splice(index, 1)
      uploadedUrls.value.splice(index, 1)
    }

    const submitReview = async () => {
      if (!validateForm()) return

      const reviewData = {
        imageUrls: uploadedUrls.value.map((url) => url),
        point: form.value.rating,
        content: form.value.content,
        hashtags: form.value.hashTags,
        visibility: form.value.visibility,
        title: form.value.location,
        attractionId: form.value.attractionId,
        gugunId: form.value.gugunId,
        gugunSidoId: form.value.gugunSidoId,
      }
      // console.log('리뷰 데이터:', reviewData)
      const token = sessionStorage.getItem('accessToken')
      if (!token) {
        console.error('토큰이 없습니다. 로그인 후 다시 시도하세요.')

        return
      }
      try {
        await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/api/v1/reviews/write`, reviewData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        // console.log('리뷰가 성공적으로 업로드되었습니다.', reviewData)
        closeModal()
        location.reload()
      } catch (error) {
        console.log(reviewData)
        console.error('리뷰 업로드 실패:', error)
      }
    }
    const crews = ref<Crew[]>([])
    const fetchCrew = async () => {
      const token = sessionStorage.getItem('accessToken')
      if (!token) {
        // console.error('토큰이 없습니다. 로그인 후 다시 시도하세요.')
        return
      }
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/v1/crew/myCrew`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        crews.value = response.data
        // console.log('크루 데이터를 가져왔습니다:', crews.value)
      } catch (error) {
        console.error('리뷰 데이터를 가져오는데 실패했습니다:', error)
      }
    }

    onMounted(() => {
      fetchCrew()
    })

    const closeModal = () => {
      emit('close')
      previews.value = []
      uploadedUrls.value = []
      form.value = {
        content: '',
        hashTags: [],
        location: '',
        visibility: 0,
        rating: 0,
        title: '',
        attractionId: null,
        gugunId: null,
        gugunSidoId: null,
      }
    }

    return {
      fileInput,
      closeModal,
      handleFileUpload,
      previews,
      navigationOptions,
      removeImage,
      uploadedUrls,
      form,
      formErrors,
      setRating,
      inputHashTag,
      addHashTag,
      removeHashTag,
      validateForm,
      submitReview,
      crews,
      openLocationModal,
      isLocationModalVisible,
      closeLocationModal,
      setLocation,
    }
  },
})
</script>
