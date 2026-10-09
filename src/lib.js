export const escapeHtml=(value='')=>String(value??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
export const e=escapeHtml;
export const attr=escapeHtml;
export const qs=(sel,root=document)=>root.querySelector(sel);
export const qsa=(sel,root=document)=>[...root.querySelectorAll(sel)];
export const byId=id=>document.getElementById(id);
export const formatMoney=(v,c='')=>`${Number(v||0).toLocaleString('ar',{maximumFractionDigits:2,minimumFractionDigits:2})} ${e(c)}`;
export const formatDate=(v)=>{if(!v)return '—';const d=new Date(v);return Number.isNaN(d.getTime())?e(v):new Intl.DateTimeFormat('ar',{dateStyle:'medium'}).format(d)};
export const safeExternal=url=>{try{const p=new URL(String(url||''),location.origin);return p.protocol==='https:'||p.protocol==='http:'?p.href:null}catch{return null}};
export const copy=async(value)=>{await navigator.clipboard.writeText(String(value??''))};
export const state={content:null,guides:null,me:null,meChecked:false};
export async function loadData(){const [c,g]=await Promise.all([fetch('/content/site_content.json').then(r=>{if(!r.ok)throw new Error('فشل تحميل بيانات المحتوى');return r.json()}),fetch('/content/platform_guides.json').then(r=>{if(!r.ok)throw new Error('فشل تحميل الشروحات');return r.json()})]);state.content=c;state.guides=g;return state}
export const badge=(label)=>`<span class="tag">${e(label)}</span>`;
export const actionLink=(href,label,style='primary')=>`<a class="button ${style}" href="${attr(href)}" data-link>${e(label)} <span aria-hidden="true">↗</span></a>`;
export const blank=(title,copyText='')=>`<div class="empty"><span class="empty-glyph" aria-hidden="true">◌</span><h3>${e(title)}</h3><p>${e(copyText)}</p></div>`;
export function notify(message,type='good'){let n=qs('#toast');if(!n){n=document.createElement('div');n.id='toast';document.body.append(n)}n.className=`toast ${type}`;n.textContent=message;n.setAttribute('role','status');clearTimeout(notify.timer);notify.timer=setTimeout(()=>n.classList.add('out'),5500)}
export function title(v,desc=''){document.title=`${v} | OnStar`;const summary=desc||'OnStar — منظومة إدارة الشبكات';qs('meta[name="description"]')?.setAttribute('content',summary);qs('meta[property="og:title"]')?.setAttribute('content',document.title);qs('meta[property="og:description"]')?.setAttribute('content',summary)}
export function input(name,label,type='text',more=''){return `<label class="field"><span>${e(label)}</span><input name="${e(name)}" type="${e(type)}" ${more}></label>`}
export function formValues(f){return Object.fromEntries(new FormData(f).entries())}
