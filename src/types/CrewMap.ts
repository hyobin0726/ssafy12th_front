export interface Region {
  code: string
  name: string
  coordinates: Array<{ lat: number; lng: number }>
}

export interface District {
  code: string
  name: string
  coordinates: Array<{ lat: number; lng: number }>
  regionCode: string
}

export interface Place {
  id: string
  name: string
  rating: number
  description: string
  images: string[]
  address: string
}
