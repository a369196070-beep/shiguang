import { reactive } from 'vue'
import { store } from './store.js'
import { navigate, route } from './router.js'

let afterAuth = null
let toastTimer = null

export const ui = reactive({
  authOpen: false,
  authMode: 'login',
  authMessage: '',
  menuNonce: 0,
  focusSearch: 0,
  confirm: null,
  toast: { message: '', type: 'info', visible: false }
})

export function openAuth(mode = 'login', message = '', callback = null) {
  ui.authMode = mode
  ui.authMessage = message
  ui.authOpen = true
  afterAuth = callback
}

export function closeAuth() {
  ui.authOpen = false
  afterAuth = null
}

export function completeAuth(user) {
  ui.authOpen = false
  notify(`欢迎回来，${user.name}。`, 'success')
  const callback = afterAuth
  afterAuth = null
  if (callback) setTimeout(callback, 80)
}

export function notify(message, type = 'success') {
  clearTimeout(toastTimer)
  ui.toast.message = message
  ui.toast.type = type
  ui.toast.visible = false
  requestAnimationFrame(() => { ui.toast.visible = true })
  toastTimer = setTimeout(() => {
    ui.toast.visible = false
    setTimeout(() => { if (!ui.toast.visible) ui.toast.message = '' }, 320)
  }, 3400)
}

export async function handleFavorite(id) {
  if (!store.currentUser.value) {
    openAuth('login', '登录后就能收藏这道菜，下次打开还在。', () => handleFavorite(id))
    return
  }
  const result = await store.toggleFavorite(id)
  if (!result.ok) {
    notify(result.error, 'error')
    return
  }
  notify(result.favorited ? '已收进你的收藏盒。' : '已从收藏盒取出。', result.favorited ? 'success' : 'info')
}

export function requestDelete(recipe, onDeleted = null) {
  ui.confirm = {
    title: '删除这道菜？',
    message: `「${recipe.title}」删除后将无法恢复，收藏过它的人也会看不到。`,
    label: '确认删除',
    action: async () => {
      const result = await store.deleteRecipe(recipe.id)
      if (!result.ok) {
        notify(result.error, 'error')
        return
      }
      notify('菜谱已删除。', 'success')
      if (onDeleted) onDeleted()
      else if (route.name === 'recipe') navigate('/mine')
    }
  }
}

export function closeConfirm() {
  ui.confirm = null
}

export function confirmAction() {
  const action = ui.confirm?.action
  ui.confirm = null
  if (action) action()
}
