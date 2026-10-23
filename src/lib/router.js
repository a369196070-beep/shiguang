import { reactive } from 'vue'

const route = reactive({ name: 'home', id: null })

function parse() {
  const raw = location.hash.replace(/^#\/?/, '')
  const parts = raw.split('?')[0].split('/').filter(Boolean)
  if (!parts.length) return { name: 'home', id: null }
  if (parts[0] === 'recipe' && parts[1]) return { name: 'recipe', id: decodeURIComponent(parts[1]) }
  if (['discover', 'favorites', 'upload', 'mine'].includes(parts[0])) return { name: parts[0], id: null }
  return { name: 'notfound', id: null }
}

function sync() {
  Object.assign(route, parse())
}

export function navigate(path) {
  const target = '#' + (path.startsWith('/') ? path : '/' + path)
  if (location.hash === target) {
    sync()
    return
  }
  location.hash = target
}

window.addEventListener('hashchange', sync)
sync()

export { route }
