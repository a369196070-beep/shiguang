<script setup>
import { computed } from 'vue'
import { store } from '../lib/store.js'
import { openAuth } from '../lib/ui.js'
import AppIcon from './AppIcon.vue'

const year = new Date().getFullYear()
const user = computed(() => store.currentUser.value)
</script>

<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a class="brand brand--footer" href="#/" aria-label="食光首页">
            <span class="brand-mark" aria-hidden="true"><AppIcon name="bowl" /></span>
            <span class="brand-text"><strong>食光</strong><small>SHIGUANG</small></span>
          </a>
          <p>每天随机搭一桌菜，也把你会做的那道菜，端给更多人。</p>
          <span class="footer-stamp">好好吃饭 · 慢慢生活</span>
        </div>

        <div class="footer-col">
          <h4>逛逛</h4>
          <a href="#/">今日菜单</a>
          <a href="#/discover">发现菜谱</a>
          <a href="#/favorites">我的收藏</a>
        </div>

        <div class="footer-col">
          <h4>下厨房</h4>
          <a href="#/upload">上传拿手菜</a>
          <a href="#/mine">我的菜谱</a>
          <button v-if="!user" class="footer-text-btn" type="button" @click="openAuth('register')">注册账号</button>
        </div>

        <div class="footer-col footer-about">
          <h4>关于食光</h4>
          <p>这是一间开在浏览器里的小厨房。没有复杂的步骤，只有认真记录的食材、火候和一点点生活。</p>
          <p class="footer-local">本站为纯前端演示，账号与菜谱保存在本机浏览器中。</p>
        </div>
      </div>

      <div class="footer-bottom">
        <span>© {{ year }} 食光 SHIGUANG</span>
        <span>Made with 米饭、耐心和一点葱花</span>
      </div>
    </div>
  </footer>
</template>
