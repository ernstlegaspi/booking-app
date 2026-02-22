<template>
  <aside class="sticky top-5 rounded-3xl border border-white/70 bg-white/95 p-5 shadow-card backdrop-blur">
    <h3 class="text-lg font-bold text-slate-900">Booking summary</h3>
    <div v-if="hotel && room" class="mt-4 space-y-3">
      <div>
        <p class="text-sm font-semibold text-brand-700">{{ hotel.category }}</p>
        <p class="text-lg font-bold text-slate-900">{{ hotel.name }}</p>
        <p class="text-sm text-slate-600">{{ hotel.location }}</p>
      </div>

      <dl class="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-3 text-sm">
        <div>
          <dt class="text-slate-500">Check-in</dt>
          <dd class="font-semibold text-slate-900">{{ formatShortDate(search.checkIn) }}</dd>
        </div>
        <div>
          <dt class="text-slate-500">Check-out</dt>
          <dd class="font-semibold text-slate-900">{{ formatShortDate(search.checkOut) }}</dd>
        </div>
        <div>
          <dt class="text-slate-500">Guests</dt>
          <dd class="font-semibold text-slate-900">{{ search.guests }}</dd>
        </div>
        <div>
          <dt class="text-slate-500">Room</dt>
          <dd class="font-semibold text-slate-900">{{ room.name }}</dd>
        </div>
      </dl>

      <div class="space-y-2 rounded-2xl border border-slate-200 p-3 text-sm">
        <div class="flex items-center justify-between">
          <span>{{ formatMoney(room.price) }} x {{ nights }} night(s)</span>
          <span>{{ formatMoney(subtotal) }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span>Service fee</span>
          <span>{{ formatMoney(serviceFee) }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span>Taxes</span>
          <span>{{ formatMoney(taxAmount) }}</span>
        </div>
        <div class="flex items-center justify-between border-t border-slate-200 pt-2 text-base font-bold text-slate-900">
          <span>Total</span>
          <span>{{ formatMoney(total) }}</span>
        </div>
      </div>
    </div>

    <p v-else class="mt-4 rounded-2xl bg-amber-50 px-3 py-2 text-sm text-amber-700">
      Select a hotel and room to see your full price breakdown.
    </p>

    <div v-if="hotel && room" class="mt-4">
      <slot :total="total" />
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { Hotel, RoomOption, SearchCriteria } from '~/types/booking'
import { formatMoney, formatShortDate } from '~/utils/booking'

const props = withDefaults(
  defineProps<{
    hotel?: Hotel
    room?: RoomOption
    search: SearchCriteria
    nights: number
  }>(),
  {
    hotel: undefined,
    room: undefined
  }
)

const serviceFee = 24
const taxRate = 0.11

const subtotal = computed(() => (props.room ? props.room.price * props.nights : 0))
const taxAmount = computed(() => Math.round(subtotal.value * taxRate))
const total = computed(() => subtotal.value + serviceFee + taxAmount)
</script>
