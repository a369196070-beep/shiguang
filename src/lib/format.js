export const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
export const MONTHS_EN = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

export function formatDateLong(date = new Date()) {
  return `${date.getMonth() + 1}月${date.getDate()}日 · ${WEEKDAYS[date.getDay()]}`
}

export function formatDateShort(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

export function relativeDate(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const then = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const days = Math.round((start - then) / 86400000)
  if (days <= 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days} 天前`
  return formatDateShort(iso)
}

export function formatJoined(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月加入`
}

export function initialOf(name) {
  const chars = Array.from(String(name || '食'))
  return chars.length ? chars[0] : '食'
}

export function difficultyClass(level) {
  if (level === '进阶') return 'is-hard'
  if (level === '中等') return 'is-medium'
  return 'is-easy'
}

export function recipeTime(time) {
  return `${time} 分钟`
}
