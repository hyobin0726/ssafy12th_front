import SockJS from 'sockjs-client'
import { CompatClient, Stomp } from '@stomp/stompjs'

class WebSocketService {
  private stompClient: CompatClient | null = null
  private connected: boolean = false
  private subscriptions: { [key: string]: any } = {}

  connect() {
    const socket = new SockJS(`${import.meta.env.VITE_APP_BASE_URL}/ws`)
    this.stompClient = Stomp.over(socket)
    this.stompClient.connect(
      {},
      () => {
        console.log('WebSocket 연결 성공')
        this.connected = true
      },
      (error) => {
        console.error('WebSocket 연결 실패:', error)
      },
    )
  }

  isConnected() {
    return this.connected
  }

  subscribe(destination: string, callback: (message: any) => void) {
    if (this.stompClient && this.connected) {
      this.subscriptions[destination] = this.stompClient.subscribe(destination, (message) => {
        callback(JSON.parse(message.body))
      })
    }
  }

  unsubscribe(destination: string) {
    if (this.subscriptions[destination]) {
      this.subscriptions[destination].unsubscribe()
      delete this.subscriptions[destination]
    }
  }

  send(destination: string, body: any) {
    if (this.stompClient && this.connected) {
      this.stompClient.send(destination, {}, JSON.stringify(body))
    }
  }
}

export default new WebSocketService()
