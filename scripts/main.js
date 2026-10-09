import { getContent } from './content.js';
import { home, appPage, cloudPage, servicesPage, contactPage, faqPage, featuresPage, networkPage, mikrotikPage, updatesPage, notFound } from './marketing.js';
import { knowledge, bindKnowledge } from './knowledge.js';
import { authUi, bindAuth } from './forms.js';
import { accountShell, bindAccount, accountOnPop } from './account.js';
import { esc, icon } from './utils.js';
let sequence = 0;
const app = document.querySelector('#app');
const marketingLinks = [['/', 'الرئيسية'], ['/app', 'تطبيق OnStar'], ['/remote-access', 'OnStar Cloud'], ['/knowledge', 'مركز المعرفة'], ['/services', 'خدماتنا']];
function shell(body, current) {
    const nav = marketingLinks.map(([u, title]) => `<a href="${u}" data-link class="${u === current ? 'current' : ''}" ${u === current ? 'aria-current="page"' : ''}>${title}</a>`).join('');
    return `<a href="#main-content" class="skip-link">تجاوز القائمة إلى المحتوى</a><header class="site-header" id="site-header"><div class="container header-inner"><a class="site-logo" href="/" data-link aria-label="OnStar الرئيسية"><span class="brand-symbol">✳</span><span class="brand-word">ONSTAR <small>NETWORK ECOSYSTEM</small></span></a><nav id="main-nav" class="desktop-nav" aria-label="القائمة الرئيسية">${nav}</nav><div class="header-actions"><a href="/customer-login" class="header-login" data-link>${icon('user', 18)} حسابي</a><button type="button" id="mobile-menu" class="mobile-menu" aria-label="فتح القائمة" aria-controls="mobile-nav" aria-expanded="false">${icon('menu', 23)}</button></div></div><nav id="mobile-nav" class="mobile-nav" aria-label="التنقل على الهاتف" hidden>${nav}<a href="/customer-login" data-link>دخول المشترك</a></nav></header><main id="main-content">${body}</main><footer class="site-footer"><div class="container"><div class="footer-primary"><div><div class="footer-brand"><span class="brand-symbol">✳</span> ONSTAR</div><p>منظومة تجمع إدارة الشبكة من الهاتف، والوصول إلى الأجهزة عن بُعد عبر OnStar Cloud.</p></div><div class="footer-links"><div><strong>المنتجات</strong><a href="/app" data-link>تطبيق OnStar</a><a href="/remote-access" data-link>OnStar Cloud</a><a href="/register" data-link>إنشاء حساب</a></div><div><strong>استكشف</strong><a href="/knowledge" data-link>مركز المعرفة</a><a href="/guide" data-link>دليل الأدوات</a><a href="/faq" data-link>الأسئلة الشائعة</a><a href="/contact" data-link>تواصل معنا</a></div></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} ONSTAR — NETWORK ECOSYSTEM</span><span>صُمم ليتكيف مع عملك. باللغة العربية.</span></div></div></footer>`;
}
function updateTitle(path) {
    const labels = { '/': 'منصة OnStar', '/app': 'تطبيق OnStar', '/features': 'مميزات OnStar', '/remote-access': 'OnStar Cloud', '/onstar-cloud': 'OnStar Cloud', '/knowledge': 'مركز المعرفة', '/guide': 'دليل الأدوات', '/tutorials': 'الشروحات', '/account': 'حساب المشترك', '/register': 'إنشاء حساب', '/customer-login': 'تسجيل الدخول', '/verify-email': 'تأكيد البريد', '/forgot-password': 'استعادة كلمة المرور', '/contact': 'التواصل', '/faq': 'الأسئلة الشائعة', '/services': 'الخدمات' };
    document.title = (labels[path] || 'OnStar') + ' | OnStar';
    const robots = document.querySelector('meta[name=robots]') || document.createElement('meta');
    robots.setAttribute('name', 'robots');
    robots.setAttribute('content', ['/account', '/register', '/customer-login', '/verify-email', '/forgot-password'].includes(path) ? 'noindex,nofollow' : 'index,follow');
    document.head.appendChild(robots);
}
export function navigate(next, scroll = true) {
    if (!next.startsWith('/') || next.startsWith('//'))
        return;
    history.pushState({}, '', next);
    void render();
    if (scroll)
        window.scrollTo({ top: 0, behavior: 'instant' });
}
async function refreshAuth() { try {
    await import('./api.js').then(({ api }) => api('/me'));
    return true;
}
catch {
    return false;
} }
async function render() {
    const id = ++sequence, path = location.pathname, params = new URLSearchParams(location.search);
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
    updateTitle(path);
    if (path === '/account') {
        app.innerHTML = accountShell();
        await bindAccount(navigate);
        return;
    }
    const authRoutes = { '/register': 'register', '/customer-login': 'login', '/verify-email': 'verify', '/forgot-password': 'forgot' };
    if (authRoutes[path]) {
        app.innerHTML = authUi(authRoutes[path]);
        bindAuth(authRoutes[path], navigate, refreshAuth);
        return;
    }
    try {
        const { site, guides } = await getContent();
        if (sequence !== id)
            return;
        let page = '';
        if (path === '/')
            page = home(site);
        else if (path === '/app')
            page = appPage(site);
        else if (path === '/features')
            page = featuresPage(site);
        else if (path === '/network')
            page = networkPage(site);
        else if (path === '/updates')
            page = updatesPage(site);
        else if (path === '/mikrotik')
            page = mikrotikPage(site);
        else if (['/remote-access', '/onstar-cloud'].includes(path))
            page = cloudPage();
        else if (['/knowledge', '/guide', '/tutorials'].includes(path))
            page = knowledge(site, guides, path === '/mikrotik' ? '/guide' : path, params);
        else if (path === '/services')
            page = servicesPage(site);
        else if (path === '/contact')
            page = contactPage(site);
        else if (path === '/faq')
            page = faqPage(site);
        else
            page = notFound();
        app.innerHTML = shell(page, path);
        const b = document.querySelector('#mobile-menu'), n = document.querySelector('#mobile-nav');
        b?.addEventListener('click', () => { if (!n)
            return; n.hidden = !n.hidden; b.setAttribute('aria-expanded', String(!n.hidden)); b.innerHTML = icon(n.hidden ? 'menu' : 'close', 23); });
        if (['/knowledge', '/guide', '/tutorials'].includes(path))
            bindKnowledge(site, guides, path === '/mikrotik' ? '/guide' : path, params);
    }
    catch (err) {
        if (sequence !== id)
            return;
        app.innerHTML = shell(`<section class="simple-hero dark-surface"><div class="container"><h1>تعذر تحميل محتوى الموقع</h1><p>${esc(err instanceof Error ? err.message : 'حاول مجددًا')}</p><button id="retry-load" class="btn btn-primary">إعادة المحاولة</button></div></section>`, path);
        document.getElementById('retry-load')?.addEventListener('click', () => { void render(); });
    }
}
// Navigation remains semantic: native links work without JS router state and can be shared.
document.addEventListener('click', event => {
    const link = event.target?.closest('a[data-link]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.hasAttribute('download') || link.target === '_blank')
        return;
    const u = new URL(link.href, location.origin);
    if (u.origin !== location.origin || !u.pathname.startsWith('/'))
        return;
    event.preventDefault();
    navigate(u.pathname + u.search + u.hash);
});
window.addEventListener('popstate', () => { if (location.pathname === '/account') {
    accountOnPop();
    if (!document.querySelector('#dashboard-shell'))
        void render();
}
else
    void render(); });
void render();
