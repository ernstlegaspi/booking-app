<template>
  <article class="overflow-hidden rounded-3xl border border-white/70 bg-white/95 shadow-card">
    <div class="grid gap-0 md:grid-cols-[1.25fr,1.75fr]">
      <img :src="hotel.gallery[0]" :alt="hotel.name" class="h-56 w-full object-cover md:h-full" />
      <div class="p-5 sm:p-6">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p class="text-xs font-bold uppercase tracking-wide text-brand-700">{{ hotel.category }}</p>
            <h3 class="mt-1 text-xl font-bold text-slate-900">{{ hotel.name }}</h3>
            <p class="text-sm text-slate-600">{{ hotel.location }}</p>
          </div>
          <div class="rounded-2xl bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-800">
            {{ hotel.rating.toFixed(1) }} / 5 ({{ hotel.reviewCount }})
          </div>
        </div>

        <p class="mt-3 line-clamp-2 text-sm text-slate-700">{{ hotel.description }}</p>

        <div class="mt-4 flex flex-wrap gap-2">
          <span
            v-for="amenity in hotel.amenities.slice(0, 5)"
            :key="amenity"
            class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
          >
            {{ amenity }}
          </span>
        </div>

        <div class="mt-5 flex flex-wrap items-end justify-between gap-3 border-t border-slate-200 pt-4">
          <div>
            <p class="text-xs uppercase tracking-wide text-slate-500">From</p>
            <p class="text-2xl font-extrabold text-slate-900">{{ formatMoney(cheapestRoom.price) }}</p>
            <p class="text-xs text-slate-500">per night · {{ cheapestRoom.name }}</p>
          </div>

          <div class="space-y-2 text-right">
            <p class="text-sm font-semibold" :class="isAvailable ? 'text-emerald-700' : 'text-rose-700'">
              {{ isAvailable ? 'Available for your date' : 'Unavailable for selected date' }}
            </p>
            <button
              class="rounded-full px-5 py-2 text-sm font-bold text-white transition"
              :class="isAvailable ? 'bg-brand-600 hover:bg-brand-700' : 'cursor-not-allowed bg-slate-400'"
              :disabled="!isAvailable"
              @click="$emit('view', hotel.id)"
            >
              View details
            </button>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Hotel } from '~/types/booking'
import { formatMoney, getCheapestRoom, isHotelAvailable } from '~/utils/booking'

const props = defineProps<{
  hotel: Hotel
  checkIn: string
  guests: number
}>()

defineEmits<{
  view: [string]
}>()

const cheapestRoom = computed(() => getCheapestRoom(props.hotel))
const isAvailable = computed(() => isHotelAvailable(props.hotel, props.checkIn, props.guests))
</script>
