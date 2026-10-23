<script setup>
const props = defineProps({
  name: { type: String, required: true },
  flip: Boolean
})

const paths = {
  arrow: '<path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  arrowUpRight: '<path d="M7 17 17 7M8 7h9v9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  search: '<circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.8"/><path d="m16 16 4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" stroke-width="1.7"/><path d="m4 7 8 6 8-6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
  user: '<circle cx="12" cy="8" r="3.5" stroke="currentColor" stroke-width="1.7"/><path d="M5 19.5c.8-3.3 3.5-5 7-5s6.2 1.7 7 5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
  plus: '<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  close: '<path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  heart: '<path d="M12 20.2S4.6 15.7 4.6 10.8A4.4 4.4 0 0 1 12 7.7a4.4 4.4 0 0 1 7.4 3.1c0 4.9-7.4 9.4-7.4 9.4Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
  clock: '<circle cx="12" cy="12" r="8.2" stroke="currentColor" stroke-width="1.7"/><path d="M12 7.8v4.6l3 1.8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
  users: '<circle cx="9" cy="8.5" r="3.2" stroke="currentColor" stroke-width="1.7"/><path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5M15.5 5.7a3.2 3.2 0 0 1 0 5.9M17 14.4c2.1.4 3.4 2 3.8 4.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
  bowl: '<path d="M3.5 11h17c0 5.2-3.8 8.8-8.5 8.8S3.5 16.2 3.5 11Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M8 8c-1-1.2-1-2.3 0-3.5M12 8c-1-1.2-1-2.3 0-3.5M16 8c-1-1.2-1-2.3 0-3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  check: '<path d="m5 12.5 4.3 4.3L19 6.8" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>',
  chevron: '<path d="m7 9.5 5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  trash: '<path d="M5 7h14M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7m-8 0 .8 11.2A2 2 0 0 0 9.8 20h4.4a2 2 0 0 0 2-1.8L17 7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
  share: '<circle cx="18" cy="5.8" r="2.5" stroke="currentColor" stroke-width="1.7"/><circle cx="6" cy="12" r="2.5" stroke="currentColor" stroke-width="1.7"/><circle cx="18" cy="18.2" r="2.5" stroke="currentColor" stroke-width="1.7"/><path d="m8.3 10.8 7.4-3.7M8.3 13.2l7.4 3.7" stroke="currentColor" stroke-width="1.7"/>',
  image: '<rect x="3.5" y="5" width="17" height="14" rx="3" stroke="currentColor" stroke-width="1.7"/><circle cx="9" cy="10" r="1.6" stroke="currentColor" stroke-width="1.5"/><path d="m5 17 4.5-4.2a2 2 0 0 1 2.7 0L18 18" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
  lock: '<rect x="4.5" y="10" width="15" height="10" rx="2.5" stroke="currentColor" stroke-width="1.7"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
  logout: '<path d="M14 5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7M17 8l4 4-4 4M21 12H10" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
  spark: '<path d="M12 3.5c.5 4.6 2.9 7 7.5 7.5-4.6.5-7 2.9-7.5 7.5-.5-4.6-2.9-7-7.5-7.5 4.6-.5 7-2.9 7.5-7.5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  pen: '<path d="m14.5 5.5 4 4M5 19l1.2-4.7L16.7 3.8a1.7 1.7 0 0 1 2.4 0l1.1 1.1a1.7 1.7 0 0 1 0 2.4L9.7 17.8 5 19Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
  alert: '<circle cx="12" cy="12" r="8.3" stroke="currentColor" stroke-width="1.7"/><path d="M12 7.6v5.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="16.4" r="1.05" fill="currentColor"/>',
  refresh: '<path d="M20 7v5h-5M4 17v-5h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.3 10.2a6.7 6.7 0 0 0-11.5-2L4 11m16 2-2.8 2.8a6.7 6.7 0 0 1-11.5-2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'
}
</script>

<template>
  <span class="icon" :class="{ 'icon--flip': flip }" v-html="`<svg viewBox='0 0 24 24' fill='none' aria-hidden='true'>${paths[name] || ''}</svg>`" />
</template>
