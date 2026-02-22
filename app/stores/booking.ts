import type { BookingRecord, FilterState, SearchCriteria } from '~/types/booking'

const STORAGE_BOOKINGS = 'booking-ui:saved-bookings'
const STORAGE_RECENT_SEARCHES = 'booking-ui:recent-searches'

const defaultSearch = (): SearchCriteria => ({
  location: '',
  checkIn: '',
  checkOut: '',
  guests: 2
})

const defaultFilters = (): FilterState => ({
  priceMax: 400,
  minRating: 0,
  amenities: [],
  onlyAvailable: false
})

export const useBookingStore = defineStore('booking', {
  state: () => ({
    search: defaultSearch(),
    filters: defaultFilters(),
    selectedHotelId: null as string | null,
    selectedRoomCode: null as string | null,
    recentSearches: [] as SearchCriteria[],
    bookings: [] as BookingRecord[]
  }),
  getters: {
    hasSearchDates: (state) => Boolean(state.search.checkIn && state.search.checkOut)
  },
  actions: {
    setSearch(search: Partial<SearchCriteria>) {
      this.search = {
        ...this.search,
        ...search,
        guests: Math.max(1, Number(search.guests ?? this.search.guests))
      }
    },
    applyQuerySearch(query: Record<string, string | string[] | undefined>) {
      this.search = {
        location: typeof query.location === 'string' ? query.location : this.search.location,
        checkIn: typeof query.checkIn === 'string' ? query.checkIn : this.search.checkIn,
        checkOut: typeof query.checkOut === 'string' ? query.checkOut : this.search.checkOut,
        guests:
          typeof query.guests === 'string'
            ? Math.max(1, Number.parseInt(query.guests, 10) || this.search.guests)
            : this.search.guests
      }
    },
    saveRecentSearch(search?: SearchCriteria) {
      const target = search ?? this.search
      if (!target.location || !target.checkIn || !target.checkOut) {
        return
      }

      const withoutMatch = this.recentSearches.filter(
        (entry) =>
          !(
            entry.location === target.location &&
            entry.checkIn === target.checkIn &&
            entry.checkOut === target.checkOut &&
            entry.guests === target.guests
          )
      )

      this.recentSearches = [target, ...withoutMatch].slice(0, 6)
      this.persistRecentSearches()
    },
    setFilters(filters: Partial<FilterState>) {
      this.filters = {
        ...this.filters,
        ...filters
      }
    },
    toggleAmenity(amenity: string) {
      if (this.filters.amenities.includes(amenity)) {
        this.filters.amenities = this.filters.amenities.filter((entry) => entry !== amenity)
      } else {
        this.filters.amenities = [...this.filters.amenities, amenity]
      }
    },
    clearFilters() {
      this.filters = defaultFilters()
    },
    selectHotel(hotelId: string) {
      this.selectedHotelId = hotelId
    },
    selectRoom(roomCode: string | null) {
      this.selectedRoomCode = roomCode
    },
    clearSelection() {
      this.selectedHotelId = null
      this.selectedRoomCode = null
    },
    addBooking(payload: Omit<BookingRecord, 'id' | 'createdAt'>): BookingRecord {
      const record: BookingRecord = {
        id: `BK-${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...payload
      }

      this.bookings = [record, ...this.bookings]
      this.persistBookings()

      return record
    },
    hydrateFromStorage() {
      if (!import.meta.client) {
        return
      }

      try {
        const bookingsRaw = localStorage.getItem(STORAGE_BOOKINGS)
        const recentRaw = localStorage.getItem(STORAGE_RECENT_SEARCHES)

        if (bookingsRaw) {
          const parsed = JSON.parse(bookingsRaw) as BookingRecord[]
          this.bookings = Array.isArray(parsed) ? parsed : []
        }

        if (recentRaw) {
          const parsed = JSON.parse(recentRaw) as SearchCriteria[]
          this.recentSearches = Array.isArray(parsed) ? parsed : []
        }
      } catch {
        this.bookings = []
        this.recentSearches = []
      }
    },
    persistBookings() {
      if (!import.meta.client) {
        return
      }

      localStorage.setItem(STORAGE_BOOKINGS, JSON.stringify(this.bookings))
    },
    persistRecentSearches() {
      if (!import.meta.client) {
        return
      }

      localStorage.setItem(STORAGE_RECENT_SEARCHES, JSON.stringify(this.recentSearches))
    }
  }
})
