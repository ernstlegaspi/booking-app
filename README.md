# Booking UI App

A Nuxt 3/4-style frontend booking interface using:

- Nuxt (`nuxt`)
- Tailwind CSS (`@nuxtjs/tailwindcss`)
- Pinia global state (`@pinia/nuxt`)
- Static JSON data (hotels/services/slots)
- Local storage persistence (saved bookings + recent searches)

## Features implemented

- Search page: location, check-in, check-out, guests.
- Results page: list view + filters (price, rating, amenities, availability).
- Listing detail page: gallery, overview tab, amenities tab, reviews tab.
- Booking summary panel: selected room + pricing breakdown.
- Multi-step checkout UI:
  1. Guest details
  2. Payment
  3. Confirmation
- Form validation + success state.
- Saved bookings page backed by `localStorage`.

## Run locally

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Project structure

- `nuxt.config.ts`: Nuxt modules + global CSS config.
- `tailwind.config.ts`: Tailwind theme extension.
- `app/data/*.json`: Static booking and slot data.
- `app/stores/booking.ts`: Pinia store for search/filters/selection/bookings.
- `app/plugins/booking-hydrate.client.ts`: `localStorage` hydration.
- `app/pages/*`: Search, results, listing detail, checkout, bookings.
- `app/components/*`: Shared UI pieces (search form, result card, summary, steps).
