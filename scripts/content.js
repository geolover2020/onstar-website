let memo = null;
export function getContent() {
    return memo ||= Promise.all([
        fetch('/data/site_content.json').then(r => { if (!r.ok)
            throw Error('تعذر تحميل مكتبة المحتوى'); return r.json(); }),
        fetch('/data/platform_guides.json').then(r => { if (!r.ok)
            throw Error('تعذر تحميل شروحات المنصة'); return r.json(); })
    ]).then(([site, guides]) => ({ site, guides }));
}
