<template>
  <div class="mx-auto min-h-screen max-w-7xl px-4 pb-10 pt-5 sm:px-6 lg:px-8">
    <header class="mb-6 overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-card backdrop-blur">
      <div
        class="flex flex-col gap-3 bg-gradient-to-r from-brand-700 via-brand-600 to-sky-500 px-5 py-6 text-white sm:flex-row sm:items-center sm:justify-between sm:px-7"
      >
        <NuxtLink to="/" class="text-2xl font-extrabold tracking-tight">BookingApp</NuxtLink>
        <nav class="flex flex-wrap items-center gap-2 text-sm font-semibold">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="rounded-full px-4 py-2 transition hover:bg-white/20"
            active-class="bg-white/25"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>
      </div>
      <div class="flex items-center justify-between gap-3 px-5 py-3 text-sm text-slate-600 sm:px-7">
        <p>Booking UI demo: search, compare, and complete checkout in a frontend-only flow.</p>
        <p class="hidden rounded-full bg-brand-50 px-3 py-1 text-brand-700 sm:block">
          {{ bookingCountLabel }}
        </p>
      </div>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const store = useBookingStore()

const navItems = [
  { label: 'Search', to: '/' },
  { label: 'Results', to: '/results' },
  { label: 'Saved Bookings', to: '/bookings' }
]

const bookingCountLabel = computed(() =>
  store.bookings.length === 0 ? 'No saved bookings yet' : `${store.bookings.length} saved booking(s)`
)
</script>
