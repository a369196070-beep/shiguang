<script setup>
import { computed } from 'vue'
import { initialOf } from '../lib/format.js'

const props = defineProps({
  user: { type: Object, default: null },
  size: { type: String, default: '' }
})

const safeColor = (value) => /^#[0-9a-fA-F]{6}$/.test(String(value || '')) ? value : '#8A8274'
const color = computed(() => safeColor(props.user?.avatarColor))
const initial = computed(() => initialOf(props.user?.name))
</script>

<template>
  <span class="avatar" :class="size ? `avatar--${size}` : ''" :style="{ '--avatar-color': color }" aria-hidden="true">{{ initial }}</span>
</template>
