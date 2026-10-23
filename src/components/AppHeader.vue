<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { route, navigate } from '../lib/router.js'
import { store } from '../lib/store.js'
import { notify, openAuth, ui } from '../lib/ui.js'
import AppIcon from './AppIcon.vue'
import UserAvatar from './UserAvatar.vue'

const user = computed(() => store.currentUser.value)
const menuOpen = ref(false)

const navItems = [
  { key: 'home', href: '#/', label: '今日菜单' },
  { key: 'discover', href: '#/discover', label: '发现菜谱' },
  { key: 'favorites', href: '#/favorites', label: '我的收藏' }
]

const active = computed(() => route.name === 'recipe' ? 'discover' : route.name)

function closeMenu() {
  menuOpen.value = false
}

function onDocumentClick(event) {
  if (!event.target.closest('.user-menu')) closeMenu()
}

function search() {
  navigate('/discover')
  setTimeout(() => { ui.focusSearch += 1 }, 60)
}

async function logout() {
  closeMenu()
  await store.logout()
  notify('已退出登录。', 'info')
  navigate('/')
}

onMounted(() => document.addEventListener('click', onDocumentClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocumentClick))
</script>

<template>
  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="#/" aria-label="食光首页" @click="closeMenu">
        <span class="brand-mark" aria-hidden="true"><AppIcon name="bowl" /></span>
        <span class="brand-text"><strong>食光</strong><small>SHIGUANG</small></span>
      </a>

      <nav class="main-nav" aria-label="主导航">
        <a
          v-for="item in navItems"
          :key="item.key"
          class="nav-link"
          :class="{ 'is-active': active === item.key }"
          :href="item.href"
        >{{ item.label }}</a>
      </nav>

      <div class="header-actions">
        <button class="icon-btn header-search" type="button" aria-label="搜索菜谱" title="搜索菜谱" @click="search">
          <AppIcon name="search" />
        </button>
        <a class="btn btn-primary btn-header-upload" href="#/upload">
          <AppIcon name="pen" /><span>上传菜谱</span>
        </a>

        <div v-if="user" class="user-menu">
          <button
            class="user-menu-btn"
            type="button"
            :aria-expanded="menuOpen"
            aria-label="打开账户菜单"
            @click.stop="menuOpen = !menuOpen"
          >
            <UserAvatar :user="user" size="sm" />
            <span class="user-menu-name">{{ user.name }}</span>
            <span class="user-menu-chevron"><AppIcon name="chevron" /></span>
          </button>

          <div v-if="menuOpen" class="user-dropdown is-open">
            <div class="user-dropdown-head">
              <UserAvatar :user="user" size="md" />
              <div>
                <strong>{{ user.name }}<span v-if="user.verified" class="verified" title="官方账号"><AppIcon name="check" /></span></strong>
                <span>{{ user.email }}</span>
              </div>
            </div>
            <a href="#/mine" @click="closeMenu"><AppIcon name="bowl" /><span>我的菜谱</span></a>
            <a href="#/favorites" @click="closeMenu"><AppIcon name="heart" /><span>我的收藏</span></a>
            <button type="button" @click="logout"><AppIcon name="logout" /><span>退出登录</span></button>
          </div>
        </div>

        <button v-else class="btn btn-ghost btn-login" type="button" @click="openAuth('login')">登录 / 注册</button>
      </div>
    </div>
  </header>
</template>
