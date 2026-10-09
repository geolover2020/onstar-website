export function esc(raw) {
    return String(raw ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char] || char));
}
export function url(raw) {
    const value = String(raw || '').trim();
    if (!value)
        return '';
    try {
        const parsed = new URL(value, location.origin);
        return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : '';
    }
    catch {
        return '';
    }
}
export function path(raw) {
    const value = String(raw || '');
    return /^\/(?!\/)[\w\u0600-\u06ff%/?#=&.\-]*$/.test(value) ? value : '/';
}
export function cash(raw) { return raw === null || raw === undefined || raw === '' ? '—' : esc(raw); }
export function dtime(raw) { if (!raw)
    return '—'; const input = String(raw); const dt = new Date(input); return Number.isFinite(dt.getTime()) ? esc(new Intl.DateTimeFormat('ar', { dateStyle: 'medium' }).format(dt)) : esc(input); }
export function icon(name, size = 20) {
    const paths = {
        arrow: '<path d="M19 12H5m7-7-7 7 7 7"/>', external: '<path d="M14 5h5v5m0-5-9 9"/><path d="M19 13v6H5V5h6"/>',
        cloud: '<path d="M19 18H6a4 4 0 0 1-.7-7.94A6 6 0 0 1 17 9a4.5 4.5 0 1 1 2 9z"/>',
        smartphone: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>',
        network: '<rect x="9" y="2" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="16" y="16" width="6" height="6" rx="1"/><path d="M12 8v4H5v4m7-4h7v4"/>',
        shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
        bolt: '<path d="m13 2-9 12h7l-1 8 10-12h-7z"/>', search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
        menu: '<path d="M4 7h16M4 12h16M4 17h16"/>', close: '<path d="M5 5l14 14M19 5 5 19"/>',
        check: '<path d="m5 12 4 4L19 6"/>', user: '<circle cx="12" cy="8" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>',
        play: '<path d="m9 6 10 6-10 6z"/>', lock: '<rect x="4" y="10" width="16" height="12" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
        refresh: '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5 9a8 8 0 0 1 14-2l1 5M4 12l1 5a8 8 0 0 0 14-2"/>',
        copy: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
        filter: '<path d="M4 7h16M7 12h10M10 17h4"/>', mail: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="m2 7 10 7 10-7"/>',
        settings: '<circle cx="12" cy="12" r="3"/><path d="m18.5 7.5 2-1.2-2-3.5-2.2 1a8 8 0 0 0-3-1V1h-4v2a8 8 0 0 0-3 1l-2.2-1-2 3.5 2 1.2a8 8 0 0 0 0 3.6l-2 1.2 2 3.5 2.2-1a8 8 0 0 0 3 1v2h4v-2a8 8 0 0 0 3-1l2.2 1 2-3.5-2-1.2"/>',
        layers: '<path d="m12 2 10 6-10 6L2 8zM2 12l10 6 10-6M2 16l10 6 10-6"/>',
        book: '<path d="M12 7c-4-2-7-2-10-1v14c3-1 6-1 10 1 4-2 7-2 10-1V6c-3-1-6-1-10 1zm0 0v14"/>',
        credit: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
        upload: '<path d="M12 16V3m-5 5 5-5 5 5M4 17v4h16v-4"/>',
        bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12h4"/>',
        wifi: '<path d="M2 9a16 16 0 0 1 20 0M5 13a11 11 0 0 1 14 0m-11 4a6 6 0 0 1 8 0M12 21h.01"/>',
        logout: '<path d="M10 17l5-5-5-5m5 5H3M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7"/>',
        info: '<circle cx="12" cy="12" r="10"/><path d="M12 11v6m0-10h.01"/>'
    };
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.network}</svg>`;
}
export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
