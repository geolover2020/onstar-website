const API_BASE = (import.meta.env.VITE_ONSTAR_CUSTOMER_API_BASE || '/api/customer').replace(/\/$/, '')

function friendlyHttpError(status, text, contentType = '') {
  const raw = String(text || '')
  const html = String(contentType || '').includes('text/html') || /^\s*<!doctype html/i.test(raw) || /<html[\s>]/i.test(raw)
  if (!html) return raw.trim() || 'تعذر تنفيذ الطلب'
  if (status === 502) return 'الخدمة السحابية لم تستجب مؤقتًا (502). أعد المحاولة بعد قليل.'
  if (status === 503) return 'الخدمة قيد التشغيل أو الصيانة مؤقتًا (503). أعد المحاولة بعد قليل.'
  if (status === 504) return 'انتهت مهلة اتصال الخدمة (504). أعد المحاولة بعد قليل.'
  if (status === 404) return 'مسار الخدمة غير متاح حاليًا (404).'
  return `تعذر الاتصال بالخدمة (HTTP ${status}).`
}

async function parseResponse(res) {
  const type = res.headers.get('content-type') || ''
  let data
  if (type.includes('application/json')) {
    try { data = await res.json() } catch { data = {} }
  } else {
    const text = await res.text()
    data = res.ok ? text : friendlyHttpError(res.status, text, type)
  }
  if (!res.ok) {
    let message = typeof data === 'object' && data ? (data.detail || data.message || 'تعذر تنفيذ الطلب') : (data || 'تعذر تنفيذ الطلب')
    if (typeof message === 'string' && (/<!doctype html/i.test(message) || /<html[\s>]/i.test(message))) message = friendlyHttpError(res.status, message, type)
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
