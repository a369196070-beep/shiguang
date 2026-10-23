<script setup>
import { ui } from '../lib/ui.js'
import AppIcon from './AppIcon.vue'
</script>

<template>
  <div class="toast-region" aria-live="polite" aria-atomic="true">
    <div v-if="ui.toast.message" class="toast" :class="[`toast--${ui.toast.type}`, { 'is-visible': ui.toast.visible }]" role="status">
      <span class="toast-icon"><AppIcon :name="ui.toast.type === 'error' ? 'close' : 'check'" /></span>
      <span>{{ ui.toast.message }}</span>
    </div>
  </div>
</template>
