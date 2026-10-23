<script setup>
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { store } from '../lib/store.js'
import { closeAuth, ui } from '../lib/ui.js'
import AppIcon from './AppIcon.vue'

const emit = defineEmits(['success'])
const dialog = ref(null)
const error = ref('')
const loading = ref(false)
const login = reactive({ email: '', password: '' })
const register = reactive({ name: '', email: '', password: '', confirm: '' })

const isRegister = computed(() => ui.authMode === 'register')
const heading = computed(() => isRegister.value
  ? {
      kicker: 'JOIN THE TABLE',
      title: '开一间自己的小厨房',
      subtitle: '只需要一个名字和邮箱，就能开始分享。'
    }
  : {
      kicker: 'WELCOME BACK',
      title: '欢迎回到你的厨房',
      subtitle: '登录后可以收藏菜谱、上传拿手菜。'
    })

watch(() => ui.authOpen, async (open) => {
  if (open) {
    error.value = ''
    await nextTick()
    if (dialog.value && !dialog.value.open) dialog.value.showModal()
    setTimeout(() => {
      const el = dialog.value?.querySelector(isRegister.value ? '#registerName' : '#loginEmail')
      el?.focus()
    }, 60)
  } else if (dialog.value?.open) {
    dialog.value.close()
  }
})

watch(() => ui.authMode, () => { error.value = '' })

function switchMode(mode) {
  ui.authMode = mode
  error.value = ''
  nextTick(() => {
    const el = dialog.value?.querySelector(mode === 'register' ? '#registerName' : '#loginEmail')
    el?.focus()
  })
}

async function submitLogin() {
  if (loading.value) return
  error.value = ''
  loading.value = true
  const result = await store.login(login.email, login.password)
  loading.value = false
  if (!result.ok) {
    error.value = result.error
    return
  }
  emit('success', result.user)
}

async function submitRegister() {
  if (loading.value) return
  error.value = ''
  loading.value = true
  const result = await store.register({ ...register })
  loading.value = false
  if (!result.ok) {
    error.value = result.error
    return
  }
  emit('success', result.user)
}

async function demoLogin() {
  if (loading.value) return
  error.value = ''
  loading.value = true
  const result = await store.login(store.demoAccount.email, store.demoAccount.password)
  loading.value = false
  if (!result.ok) {
    error.value = result.error
    return
  }
  emit('success', result.user)
}

function onNativeClose() {
  if (ui.authOpen) closeAuth()
}
</script>

<template>
  <dialog
    id="authDialog"
    ref="dialog"
    class="modal auth-dialog"
    aria-labelledby="authTitle"
    @close="onNativeClose"
    @cancel.prevent="closeAuth"
    @click.self="closeAuth"
  >
    <div class="auth-visual" aria-hidden="true">
      <span class="auth-visual-kicker">SHIGUANG KITCHEN</span>
      <p class="auth-quote">好好吃饭，<br>是生活最具体的浪漫。</p>
      <div class="auth-visual-art">
        <span class="auth-plate auth-plate--one">🍊</span>
        <span class="auth-plate auth-plate--two">🍳</span>
        <span class="auth-plate auth-plate--three">🥦</span>
      </div>
      <span class="auth-visual-foot">EST. 2026 · 每日新鲜</span>
    </div>

    <div class="auth-panel">
      <button class="modal-close" type="button" aria-label="关闭" @click="closeAuth"><AppIcon name="close" /></button>

      <div class="auth-tabs" role="tablist" aria-label="登录或注册">
        <button class="auth-tab" :class="{ 'is-active': !isRegister }" type="button" role="tab" :aria-selected="!isRegister" @click="switchMode('login')">登录</button>
        <button class="auth-tab" :class="{ 'is-active': isRegister }" type="button" role="tab" :aria-selected="isRegister" @click="switchMode('register')">注册</button>
      </div>

      <div class="auth-heading">
        <span class="eyebrow"><span class="eyebrow-dot"></span><span>{{ heading.kicker }}</span></span>
        <h2 id="authTitle">{{ heading.title }}</h2>
        <p>{{ heading.subtitle }}</p>
      </div>

      <div v-if="ui.authMessage" class="auth-message">{{ ui.authMessage }}</div>

      <form id="loginForm" v-show="!isRegister" class="auth-form" novalidate @submit.prevent="submitLogin">
        <label class="field">
          <span class="field-label">邮箱</span>
          <span class="input-shell">
            <AppIcon name="mail" class="input-icon" />
            <input id="loginEmail" v-model.trim="login.email" type="email" autocomplete="email" placeholder="you@example.com" required>
          </span>
        </label>
        <label class="field">
          <span class="field-label">密码</span>
          <span class="input-shell">
            <AppIcon name="lock" class="input-icon" />
            <input v-model="login.password" type="password" autocomplete="current-password" placeholder="输入密码" required>
          </span>
        </label>
        <p v-if="error" class="form-error" role="alert">{{ error }}</p>
        <button class="btn btn-accent btn-block auth-submit" type="submit" :disabled="loading">{{ loading ? '正在进入…' : '进入厨房' }}</button>
      </form>

      <form id="registerForm" v-show="isRegister" class="auth-form" novalidate @submit.prevent="submitRegister">
        <label class="field">
          <span class="field-label">你的名字</span>
          <span class="input-shell">
            <AppIcon name="user" class="input-icon" />
            <input id="registerName" v-model.trim="register.name" type="text" autocomplete="nickname" placeholder="比如：林小满" maxlength="12" required>
          </span>
        </label>
        <label class="field">
          <span class="field-label">邮箱</span>
          <span class="input-shell">
            <AppIcon name="mail" class="input-icon" />
            <input v-model.trim="register.email" type="email" autocomplete="email" placeholder="you@example.com" required>
          </span>
        </label>
        <div class="field-row">
          <label class="field">
            <span class="field-label">密码</span>
            <span class="input-shell">
              <input v-model="register.password" type="password" autocomplete="new-password" placeholder="至少 6 位" required>
            </span>
          </label>
          <label class="field">
            <span class="field-label">确认密码</span>
            <span class="input-shell">
              <input v-model="register.confirm" type="password" autocomplete="new-password" placeholder="再输入一次" required>
            </span>
          </label>
        </div>
        <p v-if="error" class="form-error" role="alert">{{ error }}</p>
        <button class="btn btn-accent btn-block auth-submit" type="submit" :disabled="loading">{{ loading ? '正在开张…' : '开一间小厨房' }}</button>
      </form>

      <div class="demo-box">
        <div class="demo-box-copy">
          <strong>只是想先逛逛？</strong>
          <span>体验账号：xiaoman@shiguang.app · 密码 123456</span>
        </div>
        <button class="btn btn-mini btn-ghost" type="button" :disabled="loading" @click="demoLogin">一键体验</button>
      </div>
      <p class="auth-fineprint">登录即表示你愿意一起维护一个友善、认真吃饭的小社区。</p>
    </div>
  </dialog>
</template>
