const API_BASE = (import.meta.env.VITE_ONSTAR_CUSTOMER_API_BASE || '/api/customer').replace(/\/$/, '')

async function parseResponse(res) {
  const type = res.headers.get('content-type') || ''
  const data = type.includes('application/json') ? await res.json() : await res.text()
  if (!res.ok) {
    const message = typeof data === 'object' && data ? (data.detail || data.message || 'تعذر تنفيذ الطلب') : (data || 'تعذر تنفيذ الطلب')
    const err = new Error(message)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export async function customerApi(path, options = {}) {
  const headers = new Headers(options.headers || {})
  const hasBody = options.body !== undefined && options.body !== null
  const isForm = typeof FormData !== 'undefined' && options.body instanceof FormData
  if (hasBody && !isForm && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  if (!headers.has('Accept')) headers.set('Accept', 'application/json')

  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    cache: 'no-store',
    ...options,
    headers,
  })
  return parseResponse(res)
}

export function postJson(path, body) {
  return customerApi(path, { method: 'POST', body: JSON.stringify(body) })
}

export function patchJson(path, body) {
  return customerApi(path, { method: 'PATCH', body: JSON.stringify(body) })
}

export { API_BASE }
