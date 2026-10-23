<script setup>
import { computed } from 'vue'
import { store } from '../lib/store.js'

const props = defineProps({
  recipe: { type: Object, required: true },
  badge: { type: String, default: '' },
  className: { type: String, default: '' }
})

const category = computed(() => store.categories.find((c) => c.name === props.recipe.category) || store.categories[0])
const tone = computed(() => category.value.tone)
</script>

<template>
  <div
    class="dish-art"
    :class="[className, { 'has-image': recipe.image }]"
    :style="{ '--c1': tone[0], '--c2': tone[1] }"
    :role="recipe.image ? null : 'img'"
    :aria-label="recipe.image ? null : `${recipe.title} 插画`"
  >
    <img v-if="recipe.image" :src="recipe.image" :alt="recipe.title" loading="lazy">
    <template v-else>
      <span class="dish-wash" aria-hidden="true"></span>
      <span class="dish-plate" aria-hidden="true"></span>
      <span class="dish-emoji" aria-hidden="true">{{ recipe.emoji || category.emoji }}</span>
      <span class="dish-herb dish-herb--a" aria-hidden="true"></span>
      <span class="dish-herb dish-herb--b" aria-hidden="true"></span>
      <span class="dish-dot dish-dot--a" aria-hidden="true"></span>
      <span class="dish-dot dish-dot--b" aria-hidden="true"></span>
      <span class="dish-dot dish-dot--c" aria-hidden="true"></span>
    </template>
    <span class="dish-cat">{{ category.emoji }} {{ recipe.category }}</span>
    <span v-if="badge" class="dish-badge">{{ badge }}</span>
  </div>
</template>
