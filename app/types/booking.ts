export interface SearchCriteria {
  location: string
  checkIn: string
  checkOut: string
  guests: number
}

export interface FilterState {
  priceMax: number
  minRating: number
  amenities: string[]
  onlyAvailable: boolean
}

export interface RoomOption {
  code: string
  name: string
  price: number
  capacity: number
  refundable: boolean
}

export interface Review {
  author: string
  rating: number
  date: string
  comment: string
}

export interface Hotel {
  id: string
  name: string
  location: string
  category: string
  rating: number
  reviewCount: number
  description: string
  amenities: string[]
  gallery: string[]
  policies: string[]
  nearby: string[]
  rooms: RoomOption[]
  availability: Record<string, number>
  reviews: Review[]
}

export interface Service {
  id: string
  name: string
  durationMinutes: number
  basePrice: number
  location: string
}

export interface Slot {
  id: string
  serviceId: string
  date: string
  time: string
  available: boolean
}

export interface BookingRecord {
  id: string
  createdAt: string
  hotelId: string
  hotelName: string
  roomCode: string
  roomName: string
  search: SearchCriteria
  guestName: string
  guestEmail: string
  total: number
  paymentLast4: string
}
