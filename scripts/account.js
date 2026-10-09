import { api, post, put, ApiError } from './api.js';
import { esc, icon, cash, dtime, url } from './utils.js';
const menu = [['overview', 'نظرة عامة', 'layers'], ['plans', 'الباقات والاشتراك', 'credit'], ['invoices', 'الفواتير والدفع', 'upload'], ['trial', 'التجربة المجانية', 'bolt'], ['mikrotik', 'التحقق والاتصال', 'settings'], ['access', 'الوصول والمنافذ', 'network'], ['devices', 'لوحة الأجهزة', 'wifi'], ['security', 'الحساب والأمان', 'shield']];
const serviceStates = { inactive: 'غير مفعّلة', trial_pending: 'التجربة بانتظار الموافقة', trial_active: 'تجربة مجانية نشطة', trial_expired: 'انتهت التجربة', active: 'نشطة', grace: 'فترة سماح', credit: 'آجل', suspended: 'موقوفة', cancelled: 'ملغاة' };
const reviewStates = { pending_admin: 'بانتظار مراجعة الإدارة', approved: 'تم الاعتماد', rejected: 'مرفوض' };
const money = (x, unit = '') => `${cash(x)} ${esc(unit || '')}`;
const panel = (k, t, body) => `<section class="dash-panel"><div class="panel-top"><span>${k}</span><h2>${t}</h2></div>${body}</section>`;
const empty = (text) => `<div class="panel-empty">${icon('info', 20)} ${esc(text)}</div>`;
const status = (value) => `<span class="status-chip">${esc(serviceStates[String(value)] || value || 'غير معروف')}</span>`;
export const accountShell = () => `<div class="dashboard-shell" id="dashboard-shell"><aside class="dashboard-side"><a href="/" data-link class="dash-brand"><span class="brand-symbol">✳</span>ONSTAR <b>CLOUD</b></a><div class="dash-account-ident"><small>MEMBER WORKSPACE</small><h3>بوابة المشتركين</h3></div><nav aria-label="أقسام حساب المشترك" id="dashboard-tabs">${menu.map(([id, title, ico]) => `<a href="/account?section=${id}" data-section="${id}">${icon(ico, 20)} ${title}</a>`).join('')}</nav><div class="dash-side-bottom"><a href="/knowledge?tab=cloud" data-link>${icon('book', 18)} دليل الاستخدام</a><button data-action="logout">${icon('logout', 18)} تسجيل الخروج</button></div></aside><div class="dashboard-main"><header class="dashboard-topbar"><a href="/" data-link class="dash-mobile-logo">✳ ONSTAR</a><span class="dash-top-label">ONSTAR CLOUD / CUSTOMER PORTAL</span><div class="dashboard-toolbar"><button data-action="refresh" title="تحديث بيانات الحساب">${icon('refresh', 19)} تحديث</button><button class="dash-menu-btn" id="dash-nav-button" aria-expanded="false" aria-controls="dashboard-tabs" aria-label="فتح أقسام الحساب">${icon('menu', 23)}</button></div></header><div class="dash-container"><div id="dash-global" role="status" aria-live="polite"></div><div id="dash-root"><div class="dash-loading"><span class="loading-circle"></span><h2>جارٍ تحميل بيانات الحساب الفعلية</h2><p>يتم التحقق من الجلسة ثم قراءة بياناتك من OnStar Cloud.</p></div></div></div></div></div>`;
let me = null, config = null, plans = [], ports = null, active = 'overview', busy = false;
let verificationScript = '', vpnSetupScript = '';
const getTab = () => { const param = new URLSearchParams(location.search).get('section'); return menu.some(([key]) => key === param) ? param : 'overview'; };
const notice = (message, error = false) => { const el = document.querySelector('#dash-global'); if (el) {
    el.className = error ? 'notice error' : 'notice success';
    el.textContent = message;
    window.scrollTo({ top: 0, behavior: 'smooth' });
} };
const invoke = async (fn, feedback = '') => {
    if (busy)
        return;
    busy = true;
    setDisabled(true);
    const flash = document.querySelector('#dash-global');
    if (flash) {
        flash.textContent = '';
        flash.className = '';
    }
    try {
        await fn();
        if (feedback)
            notice(feedback);
    }
    catch (e) {
        if (e instanceof ApiError && e.status === 401) {
            me = null;
            renderInvalid('انتهت صلاحية الجلسة. يرجى تسجيل الدخول مجددًا.');
            return;
        }
        notice(e instanceof Error ? e.message : 'تعذر تنفيذ العملية', true);
    }
    finally {
        busy = false;
        setDisabled(false);
    }
};
function setDisabled(state) { document.querySelectorAll('#dash-root [data-action], #dash-root button[type=submit]').forEach(b => b.disabled = state); }
function renderInvalid(text) { const root = document.querySelector('#dash-root'); if (root)
    root.innerHTML = `<div class="dash-unavailable"><h1>تعذر الوصول للحساب</h1><p>${esc(text)}</p><a class="btn btn-primary" href="/customer-login" data-link>تسجيل الدخول</a><button class="btn btn-outline" data-action="refresh">إعادة المحاولة</button></div>`; }
async function loadData() {
    const results = await Promise.all([api('/me'), api('/config'), api('/plans')]);
    me = results[0];
    config = results[1];
    plans = Array.isArray(results[2]) ? results[2] : [];
    ports = null;
    if (me?.router?.provisioned) {
        try {
            ports = await api('/router/connection-ports');
        }
        catch (e) {
            console.warn('Connection ports unavailable:', e instanceof ApiError ? e.status : 'network');
        }
    }
    renderDashboard();
}
const card = (label, value, hint, ico) => `<div class="stat-tile"><span>${icon(ico, 19)}${esc(label)}</span><strong>${value}</strong><small>${hint}</small></div>`;
function overview() {
    const c = me.customer || {}, s = me.service || {}, r = me.router || {}, sub = me.subscription || {}, f = me.financial || {}, tr = me.trial || {};
    const curr = f.currency || config?.payment?.currency || '';
    const due = f.status === 'credit' ? money(f.credit_balance ?? 0, curr) : money(f.balance_due ?? 0, curr);
    return `<div class="dash-section-heading"><span>ACCOUNT AT A GLANCE</span><h1>مرحبًا، ${esc(c.full_name || c.network_name || 'بك')}.</h1><p>هذه البيانات مأخوذة من حسابك مباشرة. حدّثها لمعرفة آخر تغييرات حالة الخدمة.</p></div>${!c.email_verified ? `<div class="alert-strip">${icon('mail', 23)}<div><b>يرجى تأكيد البريد الإلكتروني</b><p>إتمام التأكيد ضروري قبل متابعة بعض الخدمات.</p></div><a href="/verify-email?email=${encodeURIComponent(c.email || '')}" data-link class="btn btn-primary">تأكيد البريد</a><button data-action="resend-email" class="btn btn-outline">إعادة الإرسال</button></div>` : ''}
 <div class="dash-stats">${card('حالة الخدمة', status(s.status), s.suspend_at ? 'الإيقاف المتوقع: ' + dtime(s.suspend_at) : 'وفق حالة الحساب لدى الخادم', 'wifi')}${card(f.status === 'credit' ? 'الرصيد الدائن' : 'الرصيد المستحق', due, f.status === 'credit' ? 'رصيد لصالحك محفوظ في الحساب' : 'الرصيد المسجل في النظام', 'credit')}${card('تحقق MikroTik', esc(r.serial_verified ? 'تم التحقق' : 'بانتظار التحقق'), esc(r.model || r.board_name || 'حالة الجهاز مرتبطة بالحساب'), 'settings')}${card('الوصول عن بُعد', esc(r.provisioned ? (r.remote_access_enabled ? 'الخدمة مفعلة' : 'الخدمة موقوفة') : 'غير مجهز بعد'), r.vpn_ip ? 'تم تخصيص عنوان اتصال' : 'وفق حالة التهيئة', 'network')}</div>
 <div class="dash-dual">${panel('YOUR SUBSCRIPTION', 'تفاصيل الاشتراك', `<div class="info-rows"><div><span>الباقة الحالية</span><b>${cash(sub.plan_name)}</b></div><div><span>بداية الفترة</span><b>${dtime(sub.paid_period_start)}</b></div><div><span>نهاية الفترة</span><b>${dtime(sub.paid_period_end)}</b></div><div><span>التجربة المجانية</span><b>${esc(reviewStates[tr.status] || tr.status || 'لم تُطلب')}</b></div></div><a href="/account?section=plans" class="dash-text-link" data-section="plans">إدارة الباقة ${icon('arrow', 17)}</a>`)}${panel('NEXT ACTIONS', 'إجراءات سريعة', `<div class="quick-links"><a href="/account?section=mikrotik" data-section="mikrotik">${icon('settings', 21)} تحقق من الراوتر ${icon('arrow', 17)}</a><a href="/account?section=trial" data-section="trial">${icon('bolt', 21)} التجربة المجانية ${icon('arrow', 17)}</a><a href="/account?section=invoices" data-section="invoices">${icon('credit', 21)} الفواتير والدفع ${icon('arrow', 17)}</a><a href="/account?section=devices" data-section="devices">${icon('network', 21)} لوحة الأجهزة ${icon('arrow', 17)}</a></div>`)}</div>`;
}
function subscriptions() {
    const sub = me.subscription || {};
    const orders = me.orders || [];
    const open = orders.some(x => ['pending_payment', 'pending_admin'].includes(x.status));
    return `<div class="dash-section-heading"><span>SUBSCRIPTIONS</span><h1>الباقات والاشتراك</h1><p>الباقات المعروضة والأسعار وشروطها هي البيانات الحالية من OnStar Cloud.</p></div>${panel('CURRENT SUBSCRIPTION', 'اشتراكك الحالي', `<div class="info-rows"><div><span>الباقة</span><b>${cash(sub.plan_name)}</b></div><div><span>بداية الاشتراك</span><b>${dtime(sub.paid_period_start)}</b></div><div><span>نهاية الاشتراك</span><b>${dtime(sub.paid_period_end)}</b></div></div>`)}<div class="plans-grid">${plans.length ? plans.map(p => `<article class="plan-card"><div class="plan-cap">ONSTAR CLOUD / PLAN</div><h3>${esc(p.name)}</h3><div class="plan-price">${money(p.price, p.currency)}</div><p>${cash(p.billing_months)} شهر · ${p.trial_allowed ? 'قد تتوفر تجربة وفق الأهلية' : 'بلا أهلية تجربة ضمن الباقة'}</p><button class="btn btn-primary" data-action="order" data-id="${esc(p.id)}" ${open || sub.plan_name || !me.customer?.email_verified ? 'disabled' : ''}>${sub.plan_name === p.name ? 'الباقة الحالية' : open ? 'لديك طلب مفتوح' : !me.customer?.email_verified ? 'أكّد بريدك أولًا' : 'اختيار وإنشاء فاتورة'}</button></article>`).join('') : empty('لا توجد باقات متاحة من السيرفر حاليًا.')}</div>${panel('ORDER HISTORY', 'الطلبات السابقة', orders.length ? `<div class="event-list">${orders.map((o) => `<div><b>${esc(o.invoice_no || o.id || 'طلب')}</b><span>${esc(o.status)}</span></div>`).join('')}</div>` : empty('لم يتم إنشاء أي طلب بعد.'))}`;
}
function invoices() {
    const inv = me.invoices || [], conf = me.payment_confirmations || [], f = me.financial || {}, p = config?.payment || {};
    const outstanding = inv.filter((x) => ['pending', 'partial', 'credit', 'overdue'].includes(x.status));
    return `<div class="dash-section-heading"><span>BILLING / PAYMENTS</span><h1>الفواتير وإثبات الدفع</h1><p>إرسال إثبات الدفع لا يعني اعتماده؛ مراجعة الإدارة هي التي تحدد حالة العملية.</p></div><div class="dash-dual">${panel('PAYMENT INFORMATION', 'بيانات الدفع المعتمدة', `${p.method || p.account_label || p.account_number ? `<div class="payment-identity"><small>${esc(p.method || 'وسيلة الدفع')} · ${esc(p.account_label || '')}</small><strong dir="ltr">${cash(p.account_number)}</strong><span>راجع بيانات الحساب الظاهرة قبل تنفيذ أي إيداع.</span></div>` : empty('بيانات وسيلة الدفع غير متاحة من السيرفر حاليًا.')}`)}${panel('YOUR BALANCE', 'الرصيد المالي', `<div class="balance-large">${money(f.status === 'credit' ? f.credit_balance : f.balance_due, f.currency || p.currency)}</div><p>${f.status === 'credit' ? 'رصيد دائن لصالحك' : 'المستحق وفق الحالة المالية الحالية'}</p>`)}</div>
 <div class="dash-dual payment-columns">${panel('PAYMENT SUBMISSION', 'إرسال إثبات دفع', `<form id="payment-form" class="field-grid"><label>الفاتورة <select name="invoice_id"><option value="">اختيار تلقائي من النظام</option>${outstanding.map((i) => `<option value="${esc(i.id)}">${esc(i.invoice_no)} — ${money(i.balance_due, i.currency)}</option>`).join('')}</select></label><label>اسم المودع<input required name="depositor_name" autocomplete="name"/></label><label>رقم العملية<input required name="transaction_number"/></label><div class="form-pair"><label>المبلغ<input required name="amount" inputmode="decimal"/></label><label>تاريخ الإيداع<input required name="deposit_date" type="date"/></label></div><label>ملاحظات للإدارة<textarea name="message" rows="3"></textarea></label><label>صورة أو PDF للإيصال (اختياري)<input name="receipt" type="file" accept="image/*,.pdf"/></label><p>سيتم إرسال العملية للمراجعة دون تغيير حالة الفاتورة تلقائيًا.</p><button type="submit" class="btn btn-primary">${icon('upload', 19)} إرسال إثبات الدفع</button></form>`)}${panel('INVOICE HISTORY', 'الفواتير وتأكيدات الدفع', `<h3>الفواتير</h3>${inv.length ? `<div class="event-list">${inv.map((i) => `<div><b>${esc(i.invoice_no)}</b><span>${esc(i.status)} · ${money(i.balance_due, i.currency)} · ${dtime(i.due_date)}</span></div>`).join('')}</div>` : empty('لا توجد فواتير مسجلة.')}<h3>تأكيدات الدفع</h3>${conf.length ? `<div class="event-list">${conf.map((i) => `<div><b>${esc(i.transaction_number || 'إثبات')}</b><span>${money(i.amount, i.currency)} · ${esc(reviewStates[i.status] || i.status || 'غير معروف')}</span></div>`).join('')}</div>` : empty('لا توجد عمليات بانتظار المراجعة.')}`)}</div>`;
}
function trial() {
    const t = me.trial || {};
    return `<div class="dash-section-heading"><span>FREE TRIAL</span><h1>التجربة المجانية</h1><p>يتحقق السيرفر من الأهلية، وتبدأ الفترة بعد موافقة الإدارة فقط، وليس عند إرسال الطلب.</p></div>${panel('CURRENT STATE', 'حالة التجربة', `<div class="trial-display"><div><small>الحالة الحالية</small><strong>${esc(reviewStates[t.status] || t.status || 'لم تُطلب')}</strong></div><div><small>المدة الافتراضية</small><strong>${cash(t.default_days)} أيام</strong></div><div><small>نهاية الفترة</small><strong>${dtime(t.ends_at)}</strong></div></div>${t.eligibility_reasons?.length ? `<div class="note-panel">${t.eligibility_reasons.map((x) => `<p>${esc(x)}</p>`).join('')}</div>` : ''}${t.can_request ? '<button class="btn btn-primary" data-action="trial">إرسال طلب تجربة مجانية</button>' : empty('لا يتوفر طلب تجربة جديد لحسابك بحسب حالة الأهلية الحالية.')}`)}${panel('REVIEW PROCESS', 'كيف تعمل التجربة؟', '<div class="instruction-steps"><p><b>01.</b> أكّد البريد الإلكتروني وتحقق من الراوتر.</p><p><b>02.</b> إذا كان حسابك مؤهلًا، أرسل طلب التجربة.</p><p><b>03.</b> انتظر نتيجة مراجعة الإدارة.</p><p><b>04.</b> بعد الموافقة تظهر بيانات إعداد الاتصال.</p></div>')}`;
}
function codebox(text, key) { return `<div class="script-area"><textarea readonly dir="ltr" aria-label="الكود المخصص من السيرفر">${esc(text)}</textarea><button class="btn btn-outline" data-action="copy-script" data-key="${key}">${icon('copy', 18)} نسخ النص</button></div>`; }
function mikrotik() {
    const r = me.router || {}, s = me.service || {};
    return `<div class="dash-section-heading"><span>ROUTER VERIFICATION</span><h1>تحقق MikroTik وإعداد الاتصال</h1><p>التحقق يعتمد على الجهاز الحقيقي وحالة حسابك، ولا يمكن تأكيده من المتصفح وحده.</p></div>${panel('IDENTITY CHECK', 'التحقق من الجهاز', `<div class="info-rows"><div><span>حالة التحقق</span><b>${r.serial_verified ? 'تم التحقق' : 'بانتظار التحقق'}</b></div><div><span>نوع الجهاز</span><b>${cash(r.model || r.board_name)}</b></div><div><span>Serial Number</span><b class="ltr-data">${cash(r.serial)}</b></div></div>${!r.serial_verified ? `<p>اضغط لإنشاء كود التحقق الخاص بحسابك، ثم نفّذ التعليمات داخل MikroTik واضغط تحديث.</p><button data-action="verify" class="btn btn-primary" ${!me.customer?.email_verified ? 'disabled' : ''}>إنشاء كود التحقق</button>${verificationScript ? codebox(verificationScript, 'verify') : ''}` : ''}`)}${panel('VPN CONFIGURATION', 'كود إعداد الاتصال عن بُعد', `<p>يتوفر الكود بعد تجهيز حساب الاتصال واعتماد الخدمة وفق إجراءات السيرفر.</p>${r.provisioned ? `<button class="btn btn-primary" data-action="setup">عرض كود اتصال VPN</button>${vpnSetupScript ? codebox(vpnSetupScript, 'vpn') : ''}` : empty('لم يتم تجهيز اتصال VPN لهذه الشبكة بعد.')}${s.network_last_error ? '<div class="notice error">توجد مشكلة في مزامنة الاتصال. يُرجى التواصل مع الدعم إذا استمرت.</div>' : ''}`)}`;
}
function access() {
    const r = me.router || {}, endpoints = Array.isArray(r.access_endpoints) ? r.access_endpoints : [];
    const services = ports?.services || {};
    return `<div class="dash-section-heading"><span>REMOTE CONNECTIVITY</span><h1>عناوين الوصول والمنافذ</h1><p>البيانات المعروضة هي العناوين المخصصة لحسابك من السيرفر، وليست عناوين تجريبية.</p></div>${panel('ACCESS ENDPOINTS', 'الخدمات المتاحة', `<div class="access-state">${r.provisioned ? (r.remote_access_enabled ? 'تم تفعيل الوصول عن بُعد' : 'الخدمة غير مفعلة حاليًا') : 'لم يتم تجهيز الاتصال بعد'}</div>${endpoints.length ? `<div class="endpoint-list">${endpoints.map((ep, i) => `<div><div><small>${esc(ep.label || ep.service || 'خدمة')}</small><strong dir="ltr">${esc(ep.address || '')}</strong>${ep.url ? `<small dir="ltr">${esc(ep.url)}</small>` : ''}</div><div><button data-action="copy-endpoint" data-index="${i}" aria-label="نسخ عنوان ${esc(ep.label || ep.service)}">${icon('copy', 18)}</button>${url(ep.url) && r.remote_access_enabled ? `<a class="endpoint-open" href="${esc(url(ep.url))}" target="_blank" rel="noopener noreferrer" aria-label="فتح الخدمة">${icon('external', 18)}</a>` : ''}</div></div>`).join('')}</div>` : empty('لم يتم تخصيص عناوين وصول نشطة بعد.')}${r.remote_access_host ? `<div class="host-row"><b>Remote Host:</b><code dir="ltr">${esc(r.remote_access_host)}</code></div>` : ''}`)}${ports ? panel('MIKROTIK PORTS', 'ضبط منافذ API وFTP وSSH الداخلية', `<p>المنافذ الداخلية يجب أن تطابق منافذ الخدمات المضبوطة في جهازك. المنافذ الخارجية يحددها النظام.</p><form id="ports-form" class="ports-form">${['api', 'ftp', 'ssh'].map(k => `<label>${k.toUpperCase()} الداخلي<input name="${k}_port" type="number" min="1" max="65535" required ${services[k]?.enabled === false ? 'disabled' : ''} value="${esc(services[k]?.internal_port || '')}"/><small>الخارجي: ${cash(services[k]?.public_port)}</small></label>`).join('')}<button class="btn btn-primary" type="submit">حفظ ومزامنة المنافذ</button></form>`) : ''}`;
}
function devices() {
    const r = me.router || {}, dp = r.device_portal || null;
    let portal = '';
    if (dp && url(dp.url)) {
        const u = new URL(url(dp.url));
        if (dp.username)
            u.searchParams.set('username', String(dp.username));
        portal = `<div class="device-launch"><div class="device-launch-icon">${icon('network', 53)}</div><div><span>DEVICE MANAGEMENT</span><h2>لوحة أجهزة شبكتك</h2><p>استخدم بيانات الدخول الخاصة بلوحة الأجهزة. قد تختلف عن حساب الاشتراك في الموقع.</p><div class="info-rows"><div><span>اسم المستخدم</span><b dir="ltr">${esc(dp.username)}</b></div><div><span>العدد المسموح</span><b>${cash(dp.max_devices)}</b></div></div><a href="${esc(u.href)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">فتح لوحة الأجهزة ${icon('external', 19)}</a></div></div>`;
    }
    else
        portal = empty('لم يتم توفير رابط لوحة أجهزة لهذا الحساب بعد.');
    return `<div class="dash-section-heading"><span>DEVICE CONTROL</span><h1>لوحة إدارة الأجهزة</h1><p>افتح لوحة إدارة أجهزة شبكتك عندما تكون متاحة، وستبقى الصلاحيات والبيانات خاضعة لنظام الخدمة.</p></div>${panel('YOUR DEVICE PORTAL', 'لوحة الأجهزة', portal)}${panel('ACCOUNT ACCESS', 'الدخول والأمان', `<p>عند دعم لوحة الأجهزة لتسجيل الدخول بالبصمة أو Passkey، يتم إعداد هذه الميزة من خيارات الأمان داخل لوحة الأجهزة نفسها، وليس من الموقع التسويقي.</p><a href="/knowledge?tab=cloud" data-link class="dash-text-link">استعرض شروحات لوحة الأجهزة ${icon('arrow', 18)}</a>`)}`;
}
function security() {
    const c = me.customer || {};
    return `<div class="dash-section-heading"><span>ACCOUNT & SECURITY</span><h1>الحساب والأمان</h1><p>معلومات حساب المشترك وأدوات الوصول المتعلقة به.</p></div>${panel('YOUR IDENTITY', 'بيانات الحساب', `<div class="info-rows"><div><span>الاسم</span><b>${cash(c.full_name)}</b></div><div><span>اسم الشبكة</span><b>${cash(c.network_name)}</b></div><div><span>البريد</span><b dir="ltr">${cash(c.email)}</b></div><div><span>حالة التحقق</span><b>${c.email_verified ? 'مؤكد' : 'غير مؤكد'}</b></div></div><div class="account-actions"><a href="/forgot-password" data-link class="btn btn-outline">${icon('lock', 18)} استعادة كلمة المرور</a>${!c.email_verified ? `<a href="/verify-email?email=${encodeURIComponent(c.email || '')}" data-link class="btn btn-primary">تأكيد البريد</a>` : ''}</div>`)}${panel('SECURITY POLICY', 'أمان الدخول', '<p>تُدار الجلسة عن طريق السيرفر وملفات تعريف ارتباط محمية؛ لا يحتفظ هذا الموقع بكلمة المرور في تخزين المتصفح.</p>')}`;
}
function renderDashboard() {
    if (!me)
        return;
    const root = document.querySelector('#dash-root');
    if (!root)
        return;
    active = getTab();
    for (const el of document.querySelectorAll('#dashboard-tabs [data-section]')) {
        const sel = el.dataset.section === active;
        el.classList.toggle('active', sel);
        if (sel)
            el.setAttribute('aria-current', 'page');
        else
            el.removeAttribute('aria-current');
    }
    const route = { overview, plans: subscriptions, invoices, trial, mikrotik, access, devices, security };
    root.innerHTML = route[active]();
    const sheet = document.querySelector('#dashboard-shell');
    sheet?.classList.remove('open-menu');
    document.querySelector('#dash-nav-button')?.setAttribute('aria-expanded', 'false');
}
export async function bindAccount(navigate) {
    const shell = document.querySelector('#dashboard-shell');
    if (!shell)
        return;
    shell.addEventListener('click', async (ev) => {
        const node = ev.target;
        const tab = node.closest('a[data-section]');
        if (tab) {
            ev.preventDefault();
            history.pushState({}, '', tab.href);
            renderDashboard();
            return;
        }
        const b = node.closest('[data-action]');
        if (!b)
            return;
        const a = b.dataset.action;
        if (a === 'logout') {
            await invoke(async () => { await post('/logout', {}); me = null; navigate('/customer-login'); });
            return;
        }
        if (a === 'refresh') {
            await invoke(loadData, 'تم تحديث بيانات الحساب.');
            return;
        }
        if (a === 'resend-email') {
            await invoke(async () => { const r = await post('/email/resend', { email: me.customer.email }); if (!r?.email_sent)
                throw Error('تعذر إعادة إرسال الرسالة، تواصل مع الإدارة.'); }, 'تم إرسال رمز جديد.');
            return;
        }
        if (a === 'order') {
            if (!window.confirm('إنشاء طلب باقة وفاتورة جديدة؟'))
                return;
            await invoke(async () => { const result = await post('/order', { plan_id: Number(b.dataset.id), notes: '' }); await loadData(); notice(`تم إنشاء الطلب والفاتورة ${result.invoice_no || ''}. يُرجى إرسال إثبات الدفع عند الإيداع.`); });
            return;
        }
        if (a === 'trial') {
            if (!window.confirm('هل تريد إرسال طلب التجربة للإدارة للمراجعة؟'))
                return;
            await invoke(async () => { await post('/trial/request', {}); await loadData(); notice('تم إرسال الطلب للمراجعة. التجربة لا تبدأ قبل موافقة الإدارة.'); });
            return;
        }
        if (a === 'verify') {
            await invoke(async () => { const r = await post('/router/verification-token', {}); verificationScript = String(r.script || ''); renderDashboard(); notice('تم إنشاء الكود. انسخه إلى Terminal في MikroTik ثم حدّث الحالة.'); });
            return;
        }
        if (a === 'setup') {
            await invoke(async () => { const r = await api('/router/setup-script'); vpnSetupScript = String(r.script || ''); renderDashboard(); notice('تم جلب كود الاتصال من حسابك.'); });
            return;
        }
        if (a === 'copy-script') {
            const content = b.dataset.key === 'verify' ? verificationScript : vpnSetupScript;
            await copyText(content);
            notice('تم نسخ الكود.');
            return;
        }
        if (a === 'copy-endpoint') {
            const n = Number(b.dataset.index);
            const ep = me.router?.access_endpoints?.[n];
            if (ep) {
                await copyText(String(ep.url || ep.address || ''));
                notice('تم نسخ العنوان.');
            }
            return;
        }
    });
    shell.addEventListener('submit', e => {
        const form = e.target;
        if (form.id === 'ports-form') {
            e.preventDefault();
            const data = new FormData(form);
            const values = ['api', 'ftp', 'ssh'].map(k => Number(data.get(k + '_port') || ports?.services?.[k]?.internal_port));
            if (!values.every(n => Number.isInteger(n) && n > 0 && n < 65536) || new Set(values).size !== 3) {
                notice('أدخل 3 منافذ صحيحة ومختلفة بين 1 و65535.', true);
                return;
            }
            invoke(async () => { await put('/router/connection-ports', { api_port: values[0], ftp_port: values[1], ssh_port: values[2] }); await loadData(); notice('تم حفظ المنافذ ومزامنتها بحسب استجابة الخادم.'); });
        }
        if (form.id === 'payment-form') {
            e.preventDefault();
            const fd = new FormData(form);
            const receipt = fd.get('receipt');
            if (receipt instanceof File && receipt.size === 0)
                fd.delete('receipt');
            for (const [k, v] of [...fd.entries()])
                if (v === '')
                    fd.delete(k);
            invoke(async () => { await api('/payment-confirmations', { method: 'POST', body: fd }); await loadData(); notice('تم إرسال إثبات الدفع للمراجعة؛ لا يعني ذلك اعتماد العملية.'); });
        }
    });
    document.querySelector('#dash-nav-button')?.addEventListener('click', () => {
        const opened = shell.classList.toggle('open-menu');
        document.querySelector('#dash-nav-button')?.setAttribute('aria-expanded', String(opened));
    });
    try {
        await loadData();
    }
    catch (e) {
        if (e instanceof ApiError && e.status === 401) {
            renderInvalid('يرجى تسجيل الدخول لعرض حسابك.');
        }
        else
            renderInvalid(e instanceof Error ? e.message : 'تعذر تحميل الحساب.');
    }
}
async function copyText(value) { try {
    await navigator.clipboard.writeText(value);
}
catch {
    const node = document.createElement('textarea');
    node.value = value;
    document.body.appendChild(node);
    node.select();
    document.execCommand('copy');
    node.remove();
} }
export function accountOnPop() { if (me && document.querySelector('#dashboard-shell'))
    renderDashboard(); }
