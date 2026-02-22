<template>
  <form
    class="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-card backdrop-blur sm:p-6"
    :class="compact ? 'space-y-4' : 'space-y-5'"
    @submit.prevent="submitSearch"
  >
    <div v-if="!compact" class="space-y-1">
      <h2 class="text-2xl font-bold text-slate-900">Find your next stay</h2>
      <p class="text-sm text-slate-600">Search by destination, dates, and travelers.</p>
    </div>

    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <label class="text-sm font-semibold text-slate-700">
        Location
        <input
          v-model.trim="form.location"
          type="text"
          placeholder="City or property"
          class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-medium outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
        />
      </label>

      <label class="text-sm font-semibold text-slate-700">
        Check-in
        <input
          v-model="form.checkIn"
          type="date"
          :min="todayIso"
          class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-medium outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
        />
      </label>

      <label class="text-sm font-semibold text-slate-700">
        Check-out
        <input
          v-model="form.checkOut"
          type="date"
          :min="form.checkIn || todayIso"
          class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-medium outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
        />
      </label>

      <label class="text-sm font-semibold text-slate-700">
        Guests
        <input
          v-model.number="form.guests"
          type="number"
          min="1"
          max="10"
          class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-medium outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
        />
      </label>
    </div>

    <p v-if="error" class="rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
      {{ error }}
    </p>

    <div class="flex flex-wrap items-center justify-between gap-3">
      <slot />
      <button
        type="submit"
        class="rounded-full bg-brand-600 px-6 py-2 text-sm font-bold text-white transition hover:bg-brand-700"
      >
        {{ buttonLabel }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { SearchCriteria } from '~/types/booking'

const props = withDefaults(
  defineProps<{
    initial?: Partial<SearchCriteria>
    buttonLabel?: string
    compact?: boolean
  }>(),
  {
    initial: () => ({}),
    buttonLabel: 'Search',
    compact: false
  }
)

const emit = defineEmits<{
  submit: [SearchCriteria]
}>()

const todayIso = new Date().toISOString().slice(0, 10)

const form = reactive<SearchCriteria>({
  location: props.initial.location ?? '',
  checkIn: props.initial.checkIn ?? '',
  checkOut: props.initial.checkOut ?? '',
  guests: props.initial.guests ?? 2
})

const error = ref('')

watch(
  () => props.initial,
  (value) => {
    form.location = value.location ?? form.location
    form.checkIn = value.checkIn ?? form.checkIn
    form.checkOut = value.checkOut ?? form.checkOut
    form.guests = value.guests ?? form.guests
  },
  { deep: true }
)

watch(
  () => form.checkIn,
  (checkIn) => {
    if (form.checkOut && checkIn && form.checkOut <= checkIn) {
      form.checkOut = ''
    }
  }
)

const submitSearch = () => {
  error.value = ''

  if (!form.location || !form.checkIn || !form.checkOut) {
    error.value = 'Please provide location, check-in, and check-out dates.'
    return
  }

  if (form.checkOut <= form.checkIn) {
    error.value = 'Check-out date must be after check-in date.'
    return
  }

  if (!form.guests || form.guests < 1) {
    error.value = 'At least one guest is required.'
    return
  }

  emit('submit', {
    location: form.location,
    checkIn: form.checkIn,
    checkOut: form.checkOut,
    guests: Math.max(1, Number(form.guests))
  })
}
</script>
