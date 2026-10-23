<script setup>
import { computed } from 'vue'
import { route } from '../lib/router.js'
import { store } from '../lib/store.js'
import { ui } from '../lib/ui.js'
import AppIcon from './AppIcon.vue'
import UserAvatar from './UserAvatar.vue'

const user = computed(() => store.currentUser.value)
const active = computed(() => route.name === 'recipe' ? 'discover' : route.name)

const tabs = [
  { key: 'home', href: '#/', label: '今天', icon: 'bowl' },
  { key: 'discover', href: '#/discover', label: '发现', icon: 'search' },
  { key: 'upload', href: '#/upload', label: '上传', icon: 'plus', primary: true },
  { key: 'favorites', href: '#/favorites', label: '收藏', icon: 'heart' },
  { key: 'mine', href: '#/mine', label: '我的', icon: 'users' }
]

function go(tab) {
  if (tab.key === 'discover') setTimeout(() => { ui.focusSearch += 1 }, 120)
}
</script>

<template>
  <nav class="mobile-tabbar" aria-label="移动端导航">
    <a
      v-for="tab in tabs"
      :key="tab.key"
      class="tab-item"
      :class="{ 'tab-item--upload': tab.primary, 'is-active': active === tab.key }"
      :href="tab.href"
      @click="go(tab)"
    >
      <span class="tab-icon">
        <UserAvatar v-if="tab.key === 'mine' && user" :user="user" size="tab" />
        <AppIcon v-else :name="tab.icon" />
      </span>
      <span class="tab-label">{{ tab.label }}</span>
    </a>
  </nav>
</template>
