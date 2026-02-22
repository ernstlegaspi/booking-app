import type { Hotel, RoomOption } from '~/types/booking'

export const formatMoney = (value: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)

export const formatShortDate = (date: string): string => {
  if (!date) {
    return 'Not selected'
  }

  const parsed = new Date(`${date}T12:00:00`)

  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export const calculateNights = (checkIn: string, checkOut: string): number => {
  if (!checkIn || !checkOut) {
    return 1
  }

  const inDate = new Date(`${checkIn}T12:00:00`)
  const outDate = new Date(`${checkOut}T12:00:00`)
  const ms = outDate.getTime() - inDate.getTime()

  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)))
}

export const getRoomByCode = (hotel: Hotel | undefined, roomCode: string | null): RoomOption | undefined => {
  if (!hotel || !roomCode) {
    return undefined
  }

  return hotel.rooms.find((room) => room.code === roomCode)
}

export const getCheapestRoom = (hotel: Hotel): RoomOption => {
  const [firstRoom, ...restRooms] = hotel.rooms

  if (!firstRoom) {
    throw new Error(`Hotel "${hotel.id}" must define at least one room option.`)
  }

  return restRooms.reduce((lowest, current) => (current.price < lowest.price ? current : lowest), firstRoom)
}

export const isHotelAvailable = (hotel: Hotel, checkIn: string, guests: number): boolean => {
  if (!checkIn) {
    return true
  }

  const remaining = hotel.availability[checkIn] ?? 0
  const hasCapacity = hotel.rooms.some((room) => room.capacity >= guests)

  return remaining > 0 && hasCapacity
}
