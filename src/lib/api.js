const BASE = '/api/v1'

let csrfToken = ''

export class ApiError extends Error {
  constructor(message, status = 0, fields = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fields = fields
  }
}

function readCookie(name) {
  const row = document.cookie.split('; ').find((item) => item.startsWith(name + '='))
  return row ? decodeURIComponent(row.slice(name.length + 1)) : ''
}

async function fetchCsrf() {
  if (csrfToken) return csrfToken
  const response = await fetch(BASE + '/auth/csrf', { credentials: 'include' })
  if (!response.ok) throw new ApiError('无法建立安全会话，请刷新页面重试。', response.status)
  const data = await response.json().catch(() => ({}))
  csrfToken = data.token || readCookie('XSRF-TOKEN')
  return csrfToken
}

async function request(path, options = {}, retried = false) {
  const method = (options.method || 'GET').toUpperCase()
  const headers = { Accept: 'application/json', ...(options.headers || {}) }
  const init = { method, credentials: 'include', headers }

  if (method !== 'GET' && method !== 'HEAD') {
    headers['X-XSRF-TOKEN'] = await fetchCsrf()
  }
  if (options.body !== undefined) {
    if (options.body instanceof FormData) {
      init.body = options.body
    } else {
      headers['Content-Type'] = 'application/json'
      init.body = JSON.stringify(options.body)
    }
  }

  let response
  try {
    response = await fetch(BASE + path, init)
  } catch {
    throw new ApiError('连接不上厨房服务，请确认后端已经启动。')
  }

  if (response.status === 403 && !retried) {
    csrfToken = ''
    await fetchCsrf()
    return request(path, options, true)
  }

  if (response.status === 204) return null

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new ApiError(data?.message || `请求失败（${response.status}）`, response.status, data?.fields || {})
  }
  return data
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  del: (path) => request(path, { method: 'DELETE' }),
  upload: (path, formData) => request(path, { method: 'POST', body: formData }),
  resetCsrf: () => { csrfToken = '' }
}
