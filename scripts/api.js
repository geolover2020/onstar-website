export const API_BASE = '/api/customer';
export class ApiError extends Error {
    status;
    constructor(message, status) {
        super(message);
        this.status = status;
        this.name = 'ApiError';
    }
}
function friendly(status) {
    const messages = { 401: 'انتهت جلسة الدخول أو تحتاج إلى تسجيل الدخول من جديد.', 403: 'هذا الإجراء غير متاح لحسابك أو لصلاحياتك.', 404: 'الخدمة المطلوبة غير متاحة حاليًا.', 429: 'طلبات كثيرة خلال وقت قصير. حاول لاحقًا.', 502: 'خدمة OnStar Cloud لم تستجب مؤقتًا.', 503: 'الخدمة غير متاحة مؤقتًا أو قيد الصيانة.', 504: 'انتهت مهلة الاتصال بالخدمة.' };
    return messages[status] || `تعذر تنفيذ الطلب (HTTP ${status}).`;
}
function serverMessage(raw, status) {
    const msg = typeof raw === 'string' ? raw : (typeof raw?.detail === 'string' ? raw.detail : typeof raw?.message === 'string' ? raw.message : '');
    if (!msg || /<(!doctype|html|head|body|script)\b/i.test(msg))
        return friendly(status);
    return msg.length > 350 ? friendly(status) : msg;
}
export async function api(endpoint, init = {}) {
    if (!endpoint.startsWith('/') || endpoint.startsWith('//'))
        throw new Error('مسار API غير صالح');
    const headers = new Headers(init.headers);
    if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type'))
        headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    let response;
    try {
        response = await fetch(API_BASE + endpoint, { ...init, headers, cache: 'no-store', credentials: 'include' });
    }
    catch {
        throw new ApiError('تعذر الوصول إلى الخدمة. تحقق من اتصال الإنترنت وحاول مجددًا.', 0);
    }
    const ctype = response.headers.get('content-type') || '';
    let result;
    try {
        result = ctype.includes('json') ? await response.json() : await response.text();
    }
    catch {
        if (!response.ok)
            throw new ApiError(friendly(response.status), response.status);
        throw new ApiError('استجابة غير صالحة من الخدمة.', response.status);
    }
    if (!response.ok)
        throw new ApiError(serverMessage(result, response.status), response.status);
    return result;
}
export const post = (endpoint, body) => api(endpoint, { method: 'POST', body: JSON.stringify(body) });
export const put = (endpoint, body) => api(endpoint, { method: 'PUT', body: JSON.stringify(body) });
