export interface ChatRoom {
  roomId: string
  lastMessage: string
  timestamp: string
  participants: number[]
  participant: { loginId: string; name: string; profileUrl: string }
}

export interface Message {
  senderId: number
  recipientId: number
  message: string
  timestamp: string
}
