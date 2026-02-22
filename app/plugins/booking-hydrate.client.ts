export default defineNuxtPlugin(() => {
  const store = useBookingStore()
  store.hydrateFromStorage()
})
