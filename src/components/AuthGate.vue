<script setup>
import { openAuth } from '../lib/ui.js'
import AppIcon from './AppIcon.vue'

defineProps({
  emoji: { type: String, default: '🔐' },
  kicker: { type: String, default: 'YOUR KITCHEN' },
  title: { type: String, required: true },
  text: { type: String, default: '' }
})
</script>

<template>
  <div class="page gate-page">
    <div class="container gate">
      <div class="gate-art" aria-hidden="true">
        <span class="gate-emoji">{{ emoji }}</span>
        <span class="gate-ring"></span>
        <span class="gate-spark">✳</span>
      </div>
      <span class="eyebrow"><span class="eyebrow-dot"></span>{{ kicker }}</span>
      <h1>{{ title }}</h1>
      <p>{{ text }}</p>
      <div class="gate-actions">
        <button class="btn btn-primary btn-lg" type="button" @click="openAuth('login')">登录 / 注册<AppIcon name="arrow" /></button>
        <a class="btn btn-text" href="#/discover">先逛逛菜谱</a>
      </div>
      <span class="gate-note">收藏与菜谱会保存在你的浏览器里，下次打开还在。</span>
    </div>
  </div>
</template>
