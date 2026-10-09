import { post } from './api.js';
import { esc, icon } from './utils.js';
export const authUi = (mode) => {
    const meta = { register: ['Create your account', 'مساحة عمل جديدة،\nلشبكتك.', 'أنشئ حساب OnStar Cloud للبدء. تبقى الخدمة غير مفعّلة حتى الموافقة على التجربة أو اعتماد الدفع.'], login: ['WELCOME BACK', 'أهلًا بعودتك\nإلى OnStar Cloud.', 'تابع حالة شبكتك واشتراكك وخدماتك من مكان واحد.'], verify: ['VERIFY YOUR EMAIL', 'تحقق من بريدك\nوتابع خطواتك.', 'رمز التحقق يثبت صحة عنوان البريد المستخدم لإنشاء الحساب.'], forgot: ['ACCOUNT RECOVERY', 'استعد وصولك\nإلى الحساب.', 'أرسل رمز الاستعادة إلى بريدك، ثم اختر كلمة مرور جديدة.'] }[mode];
    const value = new URLSearchParams(location.search).get('email') || '';
    const field = (id, label, type = 'text', attrs = '', required = true) => `<label for="${id}">${label}</label><input id="${id}" name="${id}" type="${type}" ${attrs} ${required ? 'required' : ''} />`;
    let content = '';
    if (mode === 'register')
        content = `${field('full_name', 'الاسم الكامل', 'text', 'autocomplete="name"')}${field('network_name', 'اسم الشبكة')}${field('email', 'البريد الإلكتروني', 'email', 'autocomplete="email" dir="ltr"')}${field('phone', 'رقم الهاتف', 'tel', 'autocomplete="tel"')}<label for="routeros_version">إصدار RouterOS</label><select name="routeros_version" id="routeros_version"><option value="7">RouterOS v7</option><option value="6">RouterOS v6</option></select>${field('password', 'كلمة المرور', 'password', 'autocomplete="new-password" minlength="8"')}${field('password_confirm', 'تأكيد كلمة المرور', 'password', 'autocomplete="new-password" minlength="8"')}`;
    if (mode === 'login')
        content = `${field('email', 'البريد الإلكتروني', 'email', 'autocomplete="email" dir="ltr"')}${field('password', 'كلمة المرور', 'password', 'autocomplete="current-password"')}`;
    if (mode === 'verify')
        content = `<label for="email">البريد الإلكتروني</label><input name="email" id="email" type="email" required dir="ltr" value="${esc(value)}" autocomplete="email"/>${field('code', 'رمز التأكيد (6 أرقام)', 'text', 'inputmode="numeric" pattern="[0-9]{6}" maxlength="6"')}`;
    if (mode === 'forgot')
        content = `${field('email', 'البريد الإلكتروني', 'email', 'autocomplete="email" dir="ltr"')}<div class="reset-step-fields" hidden>${field('code', 'رمز الاستعادة', 'text', 'inputmode="numeric" maxlength="6"', false)}${field('new_password', 'كلمة المرور الجديدة', 'password', 'autocomplete="new-password" minlength="8"', false)}${field('new_password_confirm', 'تأكيد كلمة المرور الجديدة', 'password', 'autocomplete="new-password" minlength="8"', false)}</div>`;
    const title = { register: 'إنشاء حساب', login: 'تسجيل الدخول', verify: 'تأكيد البريد الإلكتروني', forgot: 'استعادة كلمة المرور' }[mode];
    const sub = { register: 'إنشاء الحساب والمتابعة', login: 'دخول المشترك', verify: 'تأكيد البريد', forgot: 'إرسال رمز الاستعادة' }[mode];
    return `<section class="auth-shell"><div class="auth-promo"><div class="auth-promo-inner"><a href="/" data-link class="auth-brand">ONSTAR <span>✦</span> CLOUD</a><div class="auth-big-symbol">✳</div><span class="eyebrow"><i></i>${meta[0]}</span><h1>${meta[1].replace('\n', '<br/>')}</h1><p>${meta[2]}</p><div class="auth-promo-bottom"><span>SECURE ACCOUNT ACCESS</span><span>ONSTAR ECOSYSTEM</span></div></div></div><div class="auth-form-side"><div class="auth-form-wrap"><a href="/remote-access" data-link class="auth-back">${icon('arrow', 18)} العودة إلى OnStar Cloud</a><h2>${title}</h2><p>أدخل معلوماتك للمتابعة بأمان.</p><form id="auth-form" data-mode="${mode}" novalidate><div class="form-fields">${content}</div><div id="form-notice" role="status" aria-live="polite"></div><button class="btn btn-primary submit-btn" type="submit">${sub} ${icon('arrow', 18)}</button></form>${mode === 'verify' ? `<button class="text-action" id="resend" type="button">إعادة إرسال رمز التأكيد</button>` : ''}${mode === 'login' ? `<a href="/forgot-password" data-link class="text-action">نسيت كلمة المرور؟</a><p class="auth-switch">ليس لديك حساب؟ <a href="/register" data-link>أنشئ حسابًا</a></p>` : ''}${mode === 'register' ? '<p class="auth-switch">لديك حساب؟ <a href="/customer-login" data-link>تسجيل الدخول</a></p>' : ''}</div></div></section>`;
};
export function bindAuth(mode, navigate, refresh) {
    const form = document.querySelector('#auth-form'), notice = document.querySelector('#form-notice');
    if (!form || !notice)
        return;
    let stage = 1, loading = false;
    const msg = (text, success = false) => { notice.className = success ? 'notice success' : 'notice error'; notice.textContent = text; };
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (loading)
            return;
        if (!form.reportValidity())
            return;
        const data = Object.fromEntries(new FormData(form).entries());
        if ((mode === 'register' || mode === 'forgot' && stage === 2) && (data.password || data.new_password) !== (data.password_confirm || data.new_password_confirm)) {
            msg('كلمتا المرور غير متطابقتين.');
            return;
        }
        loading = true;
        const button = form.querySelector('button[type=submit]');
        if (button)
            button.disabled = true;
        notice.textContent = '';
        notice.className = '';
        try {
            if (mode === 'register') {
                const res = await post('/register', { full_name: data.full_name.trim(), network_name: data.network_name.trim(), email: data.email.trim(), phone: data.phone.trim(), routeros_version: data.routeros_version, password: data.password });
                navigate('/verify-email?email=' + encodeURIComponent(data.email.trim()) + (res?.email_sent ? '&sent=1' : ''));
            }
            else if (mode === 'login') {
                const res = await post('/login', { email: data.email.trim(), password: data.password });
                if (res?.email_verified === false) {
                    navigate('/verify-email?email=' + encodeURIComponent(data.email.trim()));
                    return;
                }
                const ok = await refresh();
                if (ok)
                    navigate('/account');
                else
                    msg('تم قبول بيانات الدخول ولكن تعذر تحميل الجلسة. جرّب الدخول إلى حسابك مجددًا.');
            }
            else if (mode === 'verify') {
                await post('/email/verify', { email: data.email.trim(), code: data.code.trim() });
                msg('تم تأكيد البريد بنجاح. يمكنك تسجيل الدخول.', true);
                form.querySelectorAll('input').forEach(x => x.readOnly = true);
                const a = document.createElement('a');
                a.className = 'btn btn-outline';
                a.href = '/customer-login';
                a.dataset.link = '';
                a.textContent = 'الانتقال لتسجيل الدخول';
                notice.appendChild(a);
            }
            else if (mode === 'forgot') {
                if (stage === 1) {
                    await post('/password/forgot', { email: data.email.trim() });
                    stage = 2;
                    form.querySelector('.reset-step-fields').hidden = false;
                    form.querySelectorAll('.reset-step-fields input').forEach(i => i.required = true);
                    form.querySelector('[name=email]').readOnly = true;
                    if (button)
                        button.textContent = 'تعيين كلمة المرور';
                    msg('إذا كان البريد مسجلًا، فسيصلك رمز الاستعادة خلال دقائق.', true);
                }
                else {
                    if (data.new_password.length < 8)
                        throw new Error('كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل.');
                    await post('/password/reset', { email: data.email.trim(), code: data.code.trim(), new_password: data.new_password });
                    msg('تم تغيير كلمة المرور. يمكنك تسجيل الدخول الآن.', true);
                }
            }
        }
        catch (err) {
            msg(err instanceof Error ? err.message : 'تعذر تنفيذ الطلب.');
        }
        finally {
            loading = false;
            if (button)
                button.disabled = false;
        }
    });
    document.querySelector('#resend')?.addEventListener('click', async () => {
        const input = form.querySelector('[name=email]');
        if (!input || !input.reportValidity())
            return;
        try {
            const result = await post('/email/resend', { email: input.value.trim() });
            msg(result?.email_sent ? 'تم إرسال رمز جديد.' : 'تعذر إرسال البريد حاليًا، تواصل مع الإدارة.', !!result?.email_sent);
        }
        catch (err) {
            msg(err instanceof Error ? err.message : 'تعذر إعادة الإرسال.');
        }
    });
}
