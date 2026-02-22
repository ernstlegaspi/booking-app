<template>
  <section class="grid gap-6 lg:grid-cols-[1.6fr,1fr]">
    <div class="space-y-5">
      <div class="rounded-3xl bg-brand-600 p-6 text-white shadow-card sm:p-8">
        <p class="text-sm font-semibold uppercase tracking-wide text-white/85">Booking UI App</p>
        <h1 class="mt-2 max-w-xl text-3xl font-extrabold leading-tight sm:text-4xl">
          Plan and book your stay in one smooth flow.
        </h1>
        <p class="mt-3 max-w-xl text-sm text-white/90 sm:text-base">
          Search destinations, compare listings, review details, and complete checkout with a frontend-only experience.
        </p>
      </div>

      <SearchForm :initial="store.search" button-label="Search available stays" @submit="onSearch">
      </SearchForm>
    </div>

    <aside class="space-y-5">
      <section class="rounded-3xl border border-white/70 bg-white/95 p-5 shadow-card">
        <div class="mb-3 flex items-center justify-between">
          <h2 class="text-lg font-bold text-slate-900">Recent searches</h2>
          <NuxtLink to="/results" class="text-xs font-semibold text-brand-700 hover:text-brand-800">Open results</NuxtLink>
        </div>
        <div v-if="store.recentSearches.length === 0" class="rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
          No recent searches yet. Run your first search to store it.
        </div>
        <ul v-else class="space-y-2">
          <li v-for="(entry, index) in store.recentSearches" :key="`${entry.location}-${entry.checkIn}-${index}`">
            <button
              class="w-full rounded-2xl border border-slate-200 px-3 py-2 text-left text-sm transition hover:border-brand-300 hover:bg-brand-50"
              @click="runRecentSearch(entry)"
            >
              <p class="font-bold text-slate-900">{{ entry.location }}</p>
              <p class="text-slate-600">
                {{ formatShortDate(entry.checkIn) }} → {{ formatShortDate(entry.checkOut) }} · {{ entry.guests }} guests
              </p>
            </button>
          </li>
        </ul>
      </section>

      <section class="rounded-3xl border border-white/70 bg-white/95 p-5 shadow-card">
        <h2 class="text-lg font-bold text-slate-900">Popular add-on services</h2>
        <p class="mt-1 text-sm text-slate-600">Appointment-style slots from static JSON data.</p>
        <ul class="mt-4 space-y-3">
          <li v-for="service in services" :key="service.id" class="rounded-2xl bg-slate-50 p-3">
            <p class="font-bold text-slate-900">{{ service.name }}</p>
            <p class="text-sm text-slate-600">
              {{ service.location }} · {{ service.durationMinutes }} mins · {{ formatMoney(service.basePrice) }}
            </p>
            <p class="mt-1 text-xs font-semibold text-brand-700">
              Next slot:
              {{ nextSlotMap[service.id] ? `${nextSlotMap[service.id].date} at ${nextSlotMap[service.id].time}` : 'No open slots' }}
            </p>
          </li>
        </ul>
      </section>
    </aside>
  </section>
</template>

<script setup lang="ts">
import servicesData from '~/data/services.json'
import slotsData from '~/data/slots.json'
import type { SearchCriteria, Service, Slot } from '~/types/booking'
import { formatMoney, formatShortDate } from '~/utils/booking'

const store = useBookingStore()
const router = useRouter()

const services = servicesData as Service[]
const slots = slotsData as Slot[]

const nextSlotMap = computed<Record<string, Slot | undefined>>(() => {
  return services.reduce<Record<string, Slot | undefined>>((accumulator, service) => {
    accumulator[service.id] = slots.find((slot) => slot.serviceId === service.id && slot.available)
    return accumulator
  }, {})
})

const goToResults = (search: SearchCriteria) => {
  router.push({
    path: '/results',
    query: {
      location: search.location,
      checkIn: search.checkIn,
      checkOut: search.checkOut,
      guests: String(search.guests)
    }
  })
}

const onSearch = (search: SearchCriteria) => {
  store.setSearch(search)
  store.saveRecentSearch(search)
  store.clearSelection()
  goToResults(search)
}

const runRecentSearch = (search: SearchCriteria) => {
  store.setSearch(search)
  goToResults(search)
}
</script>
