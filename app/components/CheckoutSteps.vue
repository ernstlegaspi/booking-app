<template>
  <ol class="grid gap-3 sm:grid-cols-3">
    <li
      v-for="(step, index) in steps"
      :key="step"
      class="rounded-2xl border px-4 py-3 text-sm font-semibold"
      :class="stepClass(index)"
    >
      <span class="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs" :class="badgeClass(index)">
        {{ index + 1 }}
      </span>
      {{ step }}
    </li>
  </ol>
</template>

<script setup lang="ts">
const props = defineProps<{
  currentStep: number
}>()

const steps = ['Guest details', 'Payment', 'Confirmation']

const stepClass = (index: number) => {
  if (index < props.currentStep) {
    return 'border-emerald-300 bg-emerald-50 text-emerald-800'
  }

  if (index === props.currentStep) {
    return 'border-brand-300 bg-brand-50 text-brand-800'
  }

  return 'border-slate-200 bg-white text-slate-500'
}

const badgeClass = (index: number) => {
  if (index < props.currentStep) {
    return 'bg-emerald-200 text-emerald-900'
  }

  if (index === props.currentStep) {
    return 'bg-brand-200 text-brand-900'
  }

  return 'bg-slate-200 text-slate-600'
}
</script>
