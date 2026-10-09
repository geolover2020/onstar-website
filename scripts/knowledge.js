import { esc, icon } from './utils.js';
const validTabs = ['tools', 'videos', 'cloud'];
export function tabFromPath(pathname, params) {
    if (pathname === '/guide')
        return 'tools';
    if (pathname === '/tutorials')
        return params.get('tab') === 'videos' ? 'videos' : 'cloud';
    const query = params.get('tab');
    return validTabs.includes(query || '') ? query : 'tools';
}
const toolAsset = (item, cat) => { const input = item.image || cat?.image; if (typeof input === 'string' && input.startsWith('/') && !input.startsWith('//'))
    return `<img src="${esc(input)}" alt="" loading="lazy"/>`; return icon('settings', 21); };
export function knowledge(site, guides, pathname, params) {
    const tab = tabFromPath(pathname, params), selectedTool = params.get('tool'), selectedGuide = params.get('guide');
    const t = site.tools.find(x => x.slug === selectedTool), g = guides.platformGuides.find(x => x.id === selectedGuide);
    if (t)
        return toolDetail(t, site);
    if (g)
        return cloudGuideDetail(g, guides);
    const cats = tab === 'tools' ? site.toolCategories : tab === 'videos' ? site.tutorialCategories : guides.platformCategories;
    return `<section class="simple-hero knowledge-hero dark-surface"><div class="container"> <span class="eyebrow"><i></i>ONSTAR / KNOWLEDGE CENTER</span><h1>اعرف أكثر.<br/><em>أنجز بثقة.</em></h1><p>المراجع والشروحات الأصلية للمنتجين، منظمة لتصل إلى المعلومة التي تحتاجها دون تعقيد.</p><div class="knowledge-counter"><span><strong>${site.tools.length}</strong> أداة</span><span><strong>${site.tutorials.length}</strong> فيديو</span><span><strong>${guides.platformGuides.length}</strong> دليل لوحة أجهزة</span></div></div></section>
 <section class="section light-surface knowledge-body"><div class="container"><div class="knowledge-tabs" role="tablist" aria-label="أقسام مركز المعرفة"><a class="${tab === 'tools' ? 'selected' : ''}" role="tab" aria-selected="${tab === 'tools'}" href="/knowledge?tab=tools" data-link>${icon('settings', 19)} أدوات OnStar</a><a class="${tab === 'videos' ? 'selected' : ''}" role="tab" aria-selected="${tab === 'videos'}" href="/knowledge?tab=videos" data-link>${icon('play', 19)} فيديوهات التطبيق</a><a class="${tab === 'cloud' ? 'selected' : ''}" role="tab" aria-selected="${tab === 'cloud'}" href="/knowledge?tab=cloud" data-link>${icon('cloud', 19)} أدلة Cloud</a></div>
 <div class="knowledge-toolbar"><div class="knowledge-search">${icon('search', 22)}<input type="search" id="knowledge-search" placeholder="ابحث عن أداة أو شرح أو مصطلح..." aria-label="بحث في المحتوى" autocomplete="off"/></div><span id="knowledge-count" aria-live="polite"></span></div>
 <div class="category-scroller" id="knowledge-categories"><button class="chip active" data-cat="all">كل الأقسام</button>${cats.map((x) => `<button class="chip ${params.get('category') === x.id ? 'active' : ''}" data-cat="${esc(x.id)}">${esc(x.title)}</button>`).join('')}</div>
 <div id="knowledge-results" class="knowledge-grid" aria-live="polite"></div></div></section>`;
}
export function knowledgeResults(site, guides, tab, query, cat) {
    const needle = query.toLocaleLowerCase('ar').trim();
    const list = tab === 'tools' ? site.tools : tab === 'videos' ? site.tutorials.filter((x) => x.enabled !== false) : guides.platformGuides;
    const out = list.filter((x) => (cat === 'all' || x.category === cat) && (!needle || [x.title, x.summary, x.description, x.intro, x.what, x.keywords, ...(x.steps || []), ...(x.tags || [])].filter(v => typeof v === 'string').join(' ').toLocaleLowerCase('ar').includes(needle)));
    const cats = tab === 'tools' ? site.toolCategories : tab === 'videos' ? site.tutorialCategories : guides.platformCategories;
    const html = out.map((item, i) => {
        const category = cats.find((c) => c.id === item.category), title = esc(item.title), categoryName = esc(category?.title || 'مكتبة OnStar');
        if (tab === 'videos') {
            const id = String(item.videoId || '');
            const valid = /^[a-zA-Z0-9_-]{11}$/.test(id);
            return `<article class="knowledge-item video-item"><div class="video-thumb">${valid ? `<img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="" loading="lazy"/>` : `<span class="video-empty">${icon('play', 39)}</span>`}<span class="video-play">${icon('play', 27)}</span></div><div class="knowledge-item-body"><span class="item-category">${categoryName}</span><h3>${title}</h3><p>${esc(item.description || 'شرح فيديو من مكتبة OnStar الأصلية.')}</p>${valid ? `<a class="item-link" href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener noreferrer">شاهد الفيديو ${icon('external', 17)}</a>` : '<small>رابط الفيديو غير متاح</small>'}</div></article>`;
        }
        const href = tab === 'tools' ? `/knowledge?tab=tools&tool=${encodeURIComponent(item.slug)}` : `/knowledge?tab=cloud&guide=${encodeURIComponent(item.id)}`;
        return `<a class="knowledge-item" href="${href}" data-link><div class="item-top"><span class="item-number">${String(i + 1).padStart(3, '0')}</span><span class="item-icon">${tab === 'tools' ? toolAsset(item, category) : icon('book', 24)}</span></div><div class="knowledge-item-body"><span class="item-category">${categoryName}</span><h3>${title}</h3><p>${esc(item.summary || 'اقرأ الشرح والخطوات التفصيلية.')}</p><span class="item-link">فتح الشرح ${icon('arrow', 18)}</span></div></a>`;
    }).join('');
    return { html: html || '<div class="empty-state"><h3>لا توجد نتائج مطابقة</h3><p>جرّب كلمة أخرى أو اختر تصنيفًا مختلفًا.</p></div>', count: out.length };
}
function detailHero(kicker, title, sub, href, label) { return `<section class="detail-hero dark-surface"><div class="container"><a class="back-link" href="${href}" data-link>${icon('arrow', 18)} ${label}</a><span class="eyebrow">${kicker}</span><h1>${esc(title)}</h1><p>${esc(sub)}</p></div></section>`; }
function toolDetail(t, site) {
    const cat = site.toolCategories.find((c) => c.id === t.category);
    const steps = Array.isArray(t.steps) ? t.steps : [], notes = Array.isArray(t.notes) ? t.notes : [];
    const video = /^[\w-]{11}$/.test(String(t.video || '')) ? `<a href="https://www.youtube.com/watch?v=${t.video}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">${icon('play', 18)} مشاهدة الشرح المرتبط</a>` : '';
    return `${detailHero('ONSTAR / TOOL REFERENCE', t.title, t.summary, '/guide', 'العودة لدليل الأدوات')}<section class="section reading-section"><div class="container reading-layout"><article class="reading-article"><span class="reading-label">${esc(cat?.title || 'دليل الأدوات')}</span><h2>ماذا تفعل هذه الأداة؟</h2><p class="reading-lead">${esc(t.what || t.summary)}</p><h2>طريقة الاستخدام</h2><ol class="reading-steps">${steps.map((s, i) => `<li><span>${String(i + 1).padStart(2, '0')}</span><p>${esc(s)}</p></li>`).join('')}</ol>${notes.length ? `<div class="reading-notes"><h3>ملاحظات مهمة</h3><ul>${notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul></div>` : ''}${video}</article><aside class="reading-aside"><div class="reading-aside-box"><small>ONSTAR / TOOLS</small><h3>${esc(t.title)}</h3><div class="reading-illustration">${toolAsset(t, cat)}</div><p>تظهر الأدوات والإعدادات الفعلية بحسب إصدار التطبيق وصلاحيات الشبكة.</p><a href="/guide" data-link>جميع الأدوات ${icon('arrow', 16)}</a></div></aside></div></section>`;
}
function cloudGuideDetail(g, guides) {
    const cat = guides.platformCategories.find((c) => c.id === g.category);
    const related = guides.platformGuides.filter((x) => x.id !== g.id && x.category === g.category).slice(0, 4);
    return `${detailHero('ONSTAR CLOUD / USER GUIDE', g.title, g.summary, '/knowledge?tab=cloud', 'العودة لمركز المعرفة')}<section class="section reading-section"><div class="container reading-layout"><article class="reading-article"><span class="reading-label">${esc(cat?.title || 'دليل الاستخدام')} · ${esc(g.audience || '')}</span><p class="reading-lead">${esc(g.intro)}</p><h2>اتبع الخطوات</h2><ol class="reading-steps">${(g.steps || []).map((s, i) => `<li><span>${String(i + 1).padStart(2, '0')}</span><p>${esc(s)}</p></li>`).join('')}</ol>${g.result ? `<div class="reading-result">${icon('check', 23)}<div><b>النتيجة المتوقعة</b><p>${esc(g.result)}</p></div></div>` : ''}${g.notes?.length ? `<div class="reading-notes"><h3>تنبيهات وملاحظات</h3><ul>${g.notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul></div>` : ''}<p>قد تختلف بعض الخيارات حسب صلاحيات حسابك وحالة الخدمة.</p></article><aside class="reading-aside"><div class="reading-aside-box"><small>دروس مرتبطة</small>${related.map((r) => `<a href="/knowledge?tab=cloud&guide=${encodeURIComponent(r.id)}" data-link>${esc(r.title)} ${icon('arrow', 16)}</a>`).join('')}</div></aside></div></section>`;
}
export function bindKnowledge(site, guides, pathname, params) {
    if (params.has('guide') || params.has('tool'))
        return;
    const field = document.querySelector('#knowledge-search'), result = document.querySelector('#knowledge-results'), count = document.querySelector('#knowledge-count'), cats = document.querySelector('#knowledge-categories');
    if (!field || !result || !count || !cats)
        return;
    const tab = tabFromPath(pathname, params);
    let cat = params.get('category') || 'all';
    for (const b of cats.querySelectorAll('button'))
        b.classList.toggle('active', b.getAttribute('data-cat') === cat);
    const update = () => { let list = knowledgeResults(site, guides, tab, field.value, cat); result.innerHTML = list.html; count.textContent = `${list.count} نتيجة`; };
    field.addEventListener('input', update);
    cats.addEventListener('click', e => { const btn = e.target.closest('button[data-cat]'); if (!btn)
        return; cat = btn.dataset.cat || 'all'; for (const b of cats.querySelectorAll('button'))
        b.classList.toggle('active', b === btn); update(); });
    update();
}
