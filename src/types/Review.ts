import type { Member } from './Member'

export interface Review {
  reviewId: number
  userId: number
  content: String
  point: number
  latitude: number
  longitude: number
  createdAt: Date
  imageUrls: string[]
  order_index: number
  title: string
  like_count: number
  liked: boolean
  comment_count: number
  member: Member
}
