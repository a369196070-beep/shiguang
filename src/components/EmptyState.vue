<script setup>
import AppIcon from './AppIcon.vue'

defineProps({
  emoji: { type: String, default: '🍽️' },
  kicker: { type: String, default: 'NOTHING HERE YET' },
  title: { type: String, required: true },
  text: { type: String, default: '' },
  actionLabel: { type: String, default: '' },
  href: { type: String, default: '' }
})
defineEmits(['action'])
</script>

<template>
  <div class="empty-state">
    <div class="empty-art" aria-hidden="true"><span>{{ emoji }}</span></div>
    <span class="eyebrow"><span class="eyebrow-dot"></span>{{ kicker }}</span>
    <h2>{{ title }}</h2>
    <p v-if="text">{{ text }}</p>
    <a v-if="href && actionLabel" class="btn btn-primary" :href="href">{{ actionLabel }}<AppIcon name="arrow" /></a>
    <button v-else-if="actionLabel" class="btn btn-primary" type="button" @click="$emit('action')">{{ actionLabel }}<AppIcon name="arrow" /></button>
    <slot />
  </div>
</template>
