import type { Timestamp } from 'firebase/firestore'

export interface ChatRoom {
  roomId: string
  lastMessage: string
  timestamp: Timestamp
  participants: number[]
  participant: { loginId: string; name: string; profileUrl: string }
}

export interface Message {
  senderId: number
  recipientId: number
  message: string
  timestamp: Timestamp
}
