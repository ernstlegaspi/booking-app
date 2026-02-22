<template>
  <section class="space-y-5">
    <div class="rounded-3xl border border-white/70 bg-white/95 p-5 shadow-card sm:p-6">
      <h1 class="text-3xl font-extrabold text-slate-900">Saved bookings</h1>
      <p class="mt-1 text-sm text-slate-600">Stored in localStorage for this browser.</p>
    </div>

    <div v-if="store.bookings.length === 0" class="rounded-3xl border border-dashed border-slate-300 bg-white/85 p-8 text-center">
      <h2 class="text-xl font-bold text-slate-900">No bookings yet</h2>
      <p class="mt-2 text-sm text-slate-600">Complete checkout to create your first saved booking.</p>
      <NuxtLink to="/" class="mt-4 inline-flex rounded-full bg-brand-600 px-5 py-2 text-sm font-bold text-white hover:bg-brand-700">
        Start searching
      </NuxtLink>
    </div>

    <div v-else class="space-y-4">
      <article v-for="booking in store.bookings" :key="booking.id" class="rounded-3xl border border-white/70 bg-white/95 p-5 shadow-card">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p class="text-xs font-bold uppercase tracking-wide text-brand-700">Booking ID {{ booking.id }}</p>
            <h2 class="mt-1 text-xl font-bold text-slate-900">{{ booking.hotelName }}</h2>
            <p class="text-sm text-slate-600">{{ booking.roomName }}</p>
          </div>
          <div class="rounded-2xl bg-brand-50 px-3 py-2 text-right">
            <p class="text-xs font-semibold text-brand-700">Total</p>
            <p class="text-lg font-extrabold text-brand-900">{{ formatMoney(booking.total) }}</p>
          </div>
        </div>

        <dl class="mt-4 grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm sm:grid-cols-3">
          <div>
            <dt class="text-slate-500">Dates</dt>
            <dd class="font-semibold text-slate-900">
              {{ formatShortDate(booking.search.checkIn) }} → {{ formatShortDate(booking.search.checkOut) }}
            </dd>
          </div>
          <div>
            <dt class="text-slate-500">Guest</dt>
            <dd class="font-semibold text-slate-900">{{ booking.guestName }}</dd>
            <dd class="text-slate-600">{{ booking.guestEmail }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Created</dt>
            <dd class="font-semibold text-slate-900">{{ formatShortDate(booking.createdAt.slice(0, 10)) }}</dd>
            <dd class="text-slate-600">{{ booking.search.guests }} guest(s)</dd>
          </div>
        </dl>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { formatMoney, formatShortDate } from '~/utils/booking'

const store = useBookingStore()
</script>
