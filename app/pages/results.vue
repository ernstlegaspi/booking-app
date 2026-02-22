<template>
  <section class="space-y-5">
    <SearchForm :initial="store.search" compact button-label="Update search" @submit="runSearch">
      <p class="text-xs font-semibold uppercase tracking-wide text-brand-700">{{ filteredHotels.length }} result(s) found</p>
    </SearchForm>

    <div class="grid gap-5 lg:grid-cols-[320px,1fr]">
      <aside class="rounded-3xl border border-white/70 bg-white/95 p-5 shadow-card">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-bold text-slate-900">Filters</h2>
          <button class="text-xs font-semibold text-brand-700 hover:text-brand-800" @click="store.clearFilters()">Reset</button>
        </div>

        <div class="space-y-5 text-sm">
          <div>
            <div class="flex items-center justify-between">
              <p class="font-semibold text-slate-700">Max price</p>
              <p class="font-bold text-brand-700">{{ formatMoney(store.filters.priceMax) }}</p>
            </div>
            <input
              :value="store.filters.priceMax"
              type="range"
              min="100"
              max="500"
              step="10"
              class="mt-2 w-full accent-brand-600"
              @input="store.setFilters({ priceMax: Number(($event.target as HTMLInputElement).value) })"
            />
          </div>

          <label class="block">
            <span class="font-semibold text-slate-700">Minimum rating</span>
            <select
              :value="store.filters.minRating"
              class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-medium outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
              @change="store.setFilters({ minRating: Number(($event.target as HTMLSelectElement).value) })"
            >
              <option :value="0">Any rating</option>
              <option :value="4">4.0 and up</option>
              <option :value="4.5">4.5 and up</option>
            </select>
          </label>

          <div>
            <p class="font-semibold text-slate-700">Amenities</p>
            <div class="mt-2 space-y-2">
              <label v-for="amenity in amenityOptions" :key="amenity" class="flex items-center gap-2">
                <input
                  :checked="store.filters.amenities.includes(amenity)"
                  type="checkbox"
                  class="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  @change="store.toggleAmenity(amenity)"
                />
                <span>{{ amenity }}</span>
              </label>
            </div>
          </div>

          <label class="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2">
            <input
              :checked="store.filters.onlyAvailable"
              type="checkbox"
              class="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              @change="store.setFilters({ onlyAvailable: !store.filters.onlyAvailable })"
            />
            <span class="font-semibold text-slate-700">Only show available stays</span>
          </label>
        </div>
      </aside>

      <div class="space-y-4">
        <div v-if="filteredHotels.length === 0" class="rounded-3xl border border-dashed border-slate-300 bg-white/85 p-8 text-center">
          <h2 class="text-xl font-bold text-slate-900">No stays match your filters</h2>
          <p class="mt-2 text-sm text-slate-600">Try increasing max price or removing one amenity filter.</p>
        </div>

        <HotelResultCard
          v-for="hotel in filteredHotels"
          :key="hotel.id"
          :hotel="hotel"
          :check-in="store.search.checkIn"
          :guests="store.search.guests"
          @view="openHotel"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import hotelsData from '~/data/hotels.json'
import type { Hotel, SearchCriteria } from '~/types/booking'
import { formatMoney, getCheapestRoom, isHotelAvailable } from '~/utils/booking'

const store = useBookingStore()
const router = useRouter()
const route = useRoute()

const hotels = hotelsData as Hotel[]

const amenityOptions = computed(() => {
  return [...new Set(hotels.flatMap((hotel) => hotel.amenities))].sort()
})

const filteredHotels = computed(() => {
  const location = store.search.location.trim().toLowerCase()

  return hotels.filter((hotel) => {
    if (location && !hotel.location.toLowerCase().includes(location) && !hotel.name.toLowerCase().includes(location)) {
      return false
    }

    if (hotel.rating < store.filters.minRating) {
      return false
    }

    if (store.filters.amenities.some((amenity) => !hotel.amenities.includes(amenity))) {
      return false
    }

    const cheapest = getCheapestRoom(hotel)
    if (cheapest.price > store.filters.priceMax) {
      return false
    }

    if (store.filters.onlyAvailable && !isHotelAvailable(hotel, store.search.checkIn, store.search.guests)) {
      return false
    }

    return true
  })
})

const pushQuery = (search: SearchCriteria) => {
  router.replace({
    path: '/results',
    query: {
      location: search.location,
      checkIn: search.checkIn,
      checkOut: search.checkOut,
      guests: String(search.guests)
    }
  })
}

const runSearch = (search: SearchCriteria) => {
  store.setSearch(search)
  store.saveRecentSearch(search)
  store.clearSelection()
  pushQuery(search)
}

const openHotel = (hotelId: string) => {
  store.selectHotel(hotelId)
  store.selectRoom(null)
  router.push(`/listing/${hotelId}`)
}

if (Object.keys(route.query).length > 0) {
  store.applyQuerySearch(route.query)
}
</script>
