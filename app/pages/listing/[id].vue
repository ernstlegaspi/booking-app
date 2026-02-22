<template>
  <section v-if="hotel" class="space-y-5">
    <NuxtLink to="/results" class="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-700 shadow">
      <span aria-hidden="true">←</span>
      Back to results
    </NuxtLink>

    <div class="grid gap-5 xl:grid-cols-[1.75fr,1fr]">
      <div class="space-y-5">
        <section class="overflow-hidden rounded-3xl border border-white/70 bg-white/95 shadow-card">
          <div class="grid gap-2 p-2 md:grid-cols-[2fr,1fr]">
            <img :src="hotel.gallery[0]" :alt="hotel.name" class="h-72 w-full rounded-2xl object-cover md:h-full" />
            <div class="grid gap-2">
              <img :src="hotel.gallery[1]" :alt="`${hotel.name} image 2`" class="h-36 w-full rounded-2xl object-cover" />
              <img :src="hotel.gallery[2]" :alt="`${hotel.name} image 3`" class="h-36 w-full rounded-2xl object-cover" />
            </div>
          </div>
          <div class="p-5 sm:p-6">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p class="text-xs font-bold uppercase tracking-wide text-brand-700">{{ hotel.category }}</p>
                <h1 class="mt-1 text-3xl font-extrabold text-slate-900">{{ hotel.name }}</h1>
                <p class="text-sm text-slate-600">{{ hotel.location }}</p>
              </div>
              <div class="rounded-2xl bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-800">
                {{ hotel.rating.toFixed(1) }} / 5 · {{ hotel.reviewCount }} reviews
              </div>
            </div>
            <p class="mt-4 text-sm text-slate-700">{{ hotel.description }}</p>
          </div>
        </section>

        <section class="rounded-3xl border border-white/70 bg-white/95 p-5 shadow-card">
          <h2 class="text-xl font-bold text-slate-900">Choose your room</h2>
          <p class="mt-1 text-sm text-slate-600">
            {{ store.search.guests }} guest(s) · {{ nights }} night(s)
            <span v-if="store.search.checkIn">· check-in {{ formatShortDate(store.search.checkIn) }}</span>
          </p>
          <p
            class="mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold"
            :class="isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'"
          >
            {{ availabilityLabel }}
          </p>

          <div class="mt-4 space-y-3">
            <label
              v-for="room in hotel.rooms"
              :key="room.code"
              class="flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition"
              :class="room.code === selectedRoomCode ? 'border-brand-400 bg-brand-50' : 'border-slate-200 bg-white hover:border-brand-200'"
            >
              <div class="flex items-center gap-3">
                <input
                  :checked="room.code === selectedRoomCode"
                  type="radio"
                  name="room"
                  class="h-4 w-4 border-slate-300 text-brand-600 focus:ring-brand-500"
                  @change="selectRoom(room.code)"
                />
                <div>
                  <p class="font-bold text-slate-900">{{ room.name }}</p>
                  <p class="text-sm text-slate-600">
                    Sleeps {{ room.capacity }} · {{ room.refundable ? 'Free cancellation' : 'Non-refundable' }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-lg font-extrabold text-slate-900">{{ formatMoney(room.price) }}</p>
                <p class="text-xs text-slate-500">per night</p>
              </div>
            </label>
          </div>
        </section>

        <section class="rounded-3xl border border-white/70 bg-white/95 p-5 shadow-card">
          <div class="flex flex-wrap gap-2">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              class="rounded-full px-4 py-2 text-sm font-semibold transition"
              :class="activeTab === tab.id ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-brand-100 hover:text-brand-800'"
              @click="activeTab = tab.id"
            >
              {{ tab.label }}
            </button>
          </div>

          <div class="mt-4">
            <div v-if="activeTab === 'overview'" class="space-y-4">
              <div>
                <h3 class="font-bold text-slate-900">Nearby</h3>
                <ul class="mt-2 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                  <li v-for="item in hotel.nearby" :key="item" class="rounded-xl bg-slate-50 px-3 py-2">
                    {{ item }}
                  </li>
                </ul>
              </div>
              <div>
                <h3 class="font-bold text-slate-900">Policies</h3>
                <ul class="mt-2 space-y-2 text-sm text-slate-700">
                  <li v-for="policy in hotel.policies" :key="policy" class="rounded-xl bg-slate-50 px-3 py-2">
                    {{ policy }}
                  </li>
                </ul>
              </div>
            </div>

            <div v-if="activeTab === 'amenities'" class="grid gap-2 sm:grid-cols-2">
              <div v-for="amenity in hotel.amenities" :key="amenity" class="rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
                {{ amenity }}
              </div>
            </div>

            <div v-if="activeTab === 'reviews'" class="space-y-3">
              <article v-for="review in hotel.reviews" :key="`${review.author}-${review.date}`" class="rounded-2xl border border-slate-200 p-4">
                <div class="flex items-center justify-between gap-3">
                  <p class="font-bold text-slate-900">{{ review.author }}</p>
                  <p class="text-sm font-semibold text-brand-700">{{ review.rating }}/5</p>
                </div>
                <p class="mt-1 text-xs text-slate-500">{{ formatShortDate(review.date) }}</p>
                <p class="mt-2 text-sm text-slate-700">{{ review.comment }}</p>
              </article>
            </div>
          </div>
        </section>
      </div>

      <BookingSummaryPanel :hotel="hotel" :room="selectedRoom" :search="store.search" :nights="nights">
        <template #default="{ total }">
          <div class="space-y-3">
            <button
              class="w-full rounded-full px-5 py-2 text-sm font-bold text-white transition"
              :class="canCheckout ? 'bg-brand-600 hover:bg-brand-700' : 'cursor-not-allowed bg-slate-400'"
              :disabled="!canCheckout"
              @click="goToCheckout"
            >
              Continue to checkout
            </button>
            <p class="text-center text-xs font-semibold text-slate-500">Estimated total: {{ formatMoney(total) }}</p>
          </div>
        </template>
      </BookingSummaryPanel>
    </div>
  </section>
</template>

<script setup lang="ts">
import hotelsData from '~/data/hotels.json'
import type { Hotel } from '~/types/booking'
import { calculateNights, formatMoney, formatShortDate, getRoomByCode, isHotelAvailable } from '~/utils/booking'

const store = useBookingStore()
const router = useRouter()
const route = useRoute()

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'amenities', label: 'Amenities' },
  { id: 'reviews', label: 'Reviews' }
] as const

const activeTab = ref<typeof tabs[number]['id']>('overview')
const selectedRoomCode = ref<string | null>(null)

const hotels = hotelsData as Hotel[]
const hotel = computed(() => hotels.find((entry) => entry.id === route.params.id))

if (!hotel.value) {
  throw createError({ statusCode: 404, statusMessage: 'Listing not found' })
}

store.selectHotel(hotel.value.id)

if (!selectedRoomCode.value) {
  selectedRoomCode.value = store.selectedRoomCode ?? hotel.value.rooms[0]?.code ?? null
  store.selectRoom(selectedRoomCode.value)
}

const nights = computed(() => calculateNights(store.search.checkIn, store.search.checkOut))
const isAvailable = computed(() => isHotelAvailable(hotel.value!, store.search.checkIn, store.search.guests))
const availabilityLabel = computed(() => {
  if (!store.search.checkIn) {
    return 'Choose dates on search page to verify inventory.'
  }

  const remaining = hotel.value?.availability[store.search.checkIn] ?? 0
  return remaining > 0 ? `${remaining} room(s) left for your check-in date` : 'No rooms left for selected check-in date'
})

const selectedRoom = computed(() => getRoomByCode(hotel.value, selectedRoomCode.value))
const canCheckout = computed(() => Boolean(hotel.value && selectedRoom.value && isAvailable.value))

const selectRoom = (code: string) => {
  selectedRoomCode.value = code
  store.selectRoom(code)
}

const goToCheckout = () => {
  if (!canCheckout.value) {
    return
  }

  router.push('/checkout')
}
</script>
