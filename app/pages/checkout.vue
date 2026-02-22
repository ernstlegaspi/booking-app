<template>
  <section v-if="hotel && room" class="space-y-5">
    <CheckoutSteps :current-step="currentStep" />

    <div class="grid gap-5 xl:grid-cols-[1.6fr,1fr]">
      <div class="rounded-3xl border border-white/70 bg-white/95 p-5 shadow-card sm:p-6">
        <div v-if="currentStep === 0" class="space-y-4">
          <div>
            <h1 class="text-2xl font-extrabold text-slate-900">Guest details</h1>
            <p class="text-sm text-slate-600">Enter traveler info to continue to payment.</p>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <label class="text-sm font-semibold text-slate-700">
              First name
              <input
                v-model.trim="guestForm.firstName"
                type="text"
                class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
              />
              <span v-if="errors.firstName" class="mt-1 block text-xs text-rose-600">{{ errors.firstName }}</span>
            </label>
            <label class="text-sm font-semibold text-slate-700">
              Last name
              <input
                v-model.trim="guestForm.lastName"
                type="text"
                class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
              />
              <span v-if="errors.lastName" class="mt-1 block text-xs text-rose-600">{{ errors.lastName }}</span>
            </label>
            <label class="text-sm font-semibold text-slate-700 sm:col-span-2">
              Email
              <input
                v-model.trim="guestForm.email"
                type="email"
                class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
              />
              <span v-if="errors.email" class="mt-1 block text-xs text-rose-600">{{ errors.email }}</span>
            </label>
            <label class="text-sm font-semibold text-slate-700 sm:col-span-2">
              Phone
              <input
                v-model.trim="guestForm.phone"
                type="tel"
                placeholder="(555) 123-4567"
                class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
              />
              <span v-if="errors.phone" class="mt-1 block text-xs text-rose-600">{{ errors.phone }}</span>
            </label>
            <label class="text-sm font-semibold text-slate-700 sm:col-span-2">
              Notes (optional)
              <textarea
                v-model.trim="guestForm.notes"
                rows="3"
                class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
              />
            </label>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-3">
            <NuxtLink to="/results" class="text-sm font-semibold text-brand-700 hover:text-brand-800">Back to results</NuxtLink>
            <button class="rounded-full bg-brand-600 px-6 py-2 text-sm font-bold text-white hover:bg-brand-700" @click="goNextFromDetails">
              Continue to payment
            </button>
          </div>
        </div>

        <div v-if="currentStep === 1" class="space-y-4">
          <div>
            <h1 class="text-2xl font-extrabold text-slate-900">Payment</h1>
            <p class="text-sm text-slate-600">Demo form only. No payment is processed.</p>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <label class="text-sm font-semibold text-slate-700 sm:col-span-2">
              Cardholder name
              <input
                v-model.trim="paymentForm.cardName"
                type="text"
                class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
              />
              <span v-if="errors.cardName" class="mt-1 block text-xs text-rose-600">{{ errors.cardName }}</span>
            </label>
            <label class="text-sm font-semibold text-slate-700 sm:col-span-2">
              Card number
              <input
                v-model.trim="paymentForm.cardNumber"
                inputmode="numeric"
                maxlength="19"
                placeholder="4242 4242 4242 4242"
                class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
              />
              <span v-if="errors.cardNumber" class="mt-1 block text-xs text-rose-600">{{ errors.cardNumber }}</span>
            </label>
            <label class="text-sm font-semibold text-slate-700">
              Expiry
              <input
                v-model.trim="paymentForm.expiry"
                placeholder="MM/YY"
                maxlength="5"
                class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
              />
              <span v-if="errors.expiry" class="mt-1 block text-xs text-rose-600">{{ errors.expiry }}</span>
            </label>
            <label class="text-sm font-semibold text-slate-700">
              CVV
              <input
                v-model.trim="paymentForm.cvv"
                inputmode="numeric"
                maxlength="4"
                class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
              />
              <span v-if="errors.cvv" class="mt-1 block text-xs text-rose-600">{{ errors.cvv }}</span>
            </label>
          </div>

          <label class="flex items-start gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-sm">
            <input
              v-model="paymentForm.agree"
              type="checkbox"
              class="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <span>I agree to the cancellation policy and booking terms.</span>
          </label>
          <p v-if="errors.agree" class="text-xs text-rose-600">{{ errors.agree }}</p>

          <div class="flex flex-wrap items-center justify-between gap-3">
            <button class="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100" @click="currentStep = 0">
              Back
            </button>
            <button class="rounded-full bg-brand-600 px-6 py-2 text-sm font-bold text-white hover:bg-brand-700" @click="confirmBooking">
              Complete booking
            </button>
          </div>
        </div>

        <div v-if="currentStep === 2 && confirmedBooking" class="space-y-4">
          <div class="rounded-3xl bg-emerald-50 p-5 text-emerald-800">
            <p class="text-xs font-bold uppercase tracking-wide">Success</p>
            <h1 class="mt-1 text-2xl font-extrabold">Booking confirmed</h1>
            <p class="mt-2 text-sm">
              Your booking id is <span class="font-bold">{{ confirmedBooking.id }}</span>. It has been saved to local storage.
            </p>
          </div>

          <div class="rounded-2xl border border-slate-200 p-4 text-sm">
            <p class="font-semibold text-slate-700">Guest</p>
            <p class="font-bold text-slate-900">{{ confirmedBooking.guestName }}</p>
            <p class="text-slate-600">{{ confirmedBooking.guestEmail }}</p>
            <p class="mt-2 text-slate-600">Payment method: ending in {{ confirmedBooking.paymentLast4 }}</p>
          </div>

          <div class="flex flex-wrap gap-3">
            <NuxtLink to="/bookings" class="rounded-full bg-brand-600 px-5 py-2 text-sm font-bold text-white hover:bg-brand-700">
              View saved bookings
            </NuxtLink>
            <NuxtLink to="/" class="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
              Start new search
            </NuxtLink>
          </div>
        </div>
      </div>

      <BookingSummaryPanel :hotel="hotel" :room="room" :search="store.search" :nights="nights">
        <template #default="{ total }">
          <div class="space-y-2 text-center text-xs text-slate-500">
            <p>Secure booking summary</p>
            <p class="font-semibold text-slate-700">Total due now: {{ formatMoney(total) }}</p>
          </div>
        </template>
      </BookingSummaryPanel>
    </div>
  </section>
</template>

<script setup lang="ts">
import hotelsData from '~/data/hotels.json'
import type { BookingRecord, Hotel } from '~/types/booking'
import { calculateNights, formatMoney, getRoomByCode } from '~/utils/booking'

const store = useBookingStore()

if (!store.selectedHotelId) {
  await navigateTo('/results')
}

const hotels = hotelsData as Hotel[]
const hotel = computed(() => hotels.find((entry) => entry.id === store.selectedHotelId))

if (!hotel.value) {
  await navigateTo('/results')
}

if (!store.selectedRoomCode && hotel.value?.rooms[0]) {
  store.selectRoom(hotel.value.rooms[0].code)
}

const room = computed(() => getRoomByCode(hotel.value, store.selectedRoomCode))

if (!room.value) {
  await navigateTo('/results')
}

const currentStep = ref(0)
const confirmedBooking = ref<BookingRecord | null>(null)
const errors = reactive<Record<string, string>>({})

const guestForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  notes: ''
})

const paymentForm = reactive({
  cardName: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
  agree: false
})

const nights = computed(() => calculateNights(store.search.checkIn, store.search.checkOut))
const subtotal = computed(() => (room.value ? room.value.price * nights.value : 0))
const total = computed(() => subtotal.value + 24 + Math.round(subtotal.value * 0.11))

const clearErrors = () => {
  Object.keys(errors).forEach((key) => {
    delete errors[key]
  })
}

const validateGuestStep = (): boolean => {
  clearErrors()
  if (!guestForm.firstName) {
    errors.firstName = 'First name is required.'
  }
  if (!guestForm.lastName) {
    errors.lastName = 'Last name is required.'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestForm.email)) {
    errors.email = 'Valid email is required.'
  }
  if (!guestForm.phone || guestForm.phone.length < 7) {
    errors.phone = 'Valid phone number is required.'
  }

  return Object.keys(errors).length === 0
}

const validatePaymentStep = (): boolean => {
  clearErrors()
  const digits = paymentForm.cardNumber.replace(/\D/g, '')
  if (!paymentForm.cardName) {
    errors.cardName = 'Cardholder name is required.'
  }
  if (digits.length < 13) {
    errors.cardNumber = 'Card number looks incomplete.'
  }
  if (!/^\d{2}\/\d{2}$/.test(paymentForm.expiry)) {
    errors.expiry = 'Use MM/YY format.'
  }
  if (!/^\d{3,4}$/.test(paymentForm.cvv)) {
    errors.cvv = 'Enter 3 or 4 digits.'
  }
  if (!paymentForm.agree) {
    errors.agree = 'You must agree to continue.'
  }

  return Object.keys(errors).length === 0
}

const goNextFromDetails = () => {
  if (validateGuestStep()) {
    currentStep.value = 1
  }
}

const confirmBooking = () => {
  if (!hotel.value || !room.value) {
    return
  }
  if (!validatePaymentStep()) {
    return
  }

  const record = store.addBooking({
    hotelId: hotel.value.id,
    hotelName: hotel.value.name,
    roomCode: room.value.code,
    roomName: room.value.name,
    search: { ...store.search },
    guestName: `${guestForm.firstName} ${guestForm.lastName}`,
    guestEmail: guestForm.email,
    total: total.value,
    paymentLast4: paymentForm.cardNumber.replace(/\D/g, '').slice(-4)
  })

  confirmedBooking.value = record
  currentStep.value = 2
}
</script>
