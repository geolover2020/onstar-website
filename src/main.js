import {loadData,state,escapeHtml as e,actionLink,title} from './lib.js';
import {frame} from './components/layout.js';
import {home,productStage,appProduct,cloudProduct,services,contact,faq} from './pages/marketing.js';
import {knowledge,libraryInteractions,guideDetail,toolDetail} from './pages/knowledge.js';
import {authView,authEvents} from './pages/auth.js';
import {accountShell,openAccount,accountEvents} from './pages/account.js';
import {get} from './api.js';
let navSequence=0;
const aliases={'/features':'/app','/network':'/app','/mikrotik':'/tools','/updates':'/app','/guide':'/tools','/tutorials':'/knowledge','/remote-access':'/cloud'};
const authRoutes=new Set(['/register','/customer-login','/verify-email','/forgot-password']);
const container=document.getElementById('app');
const notFound=()=>{title('الصفحة غير موجودة');return `<section class="page-title dark"><div class="shell"><span class="eyebrow">ERROR / 404</span><h1>هذا الطريق<br/><em>ليس على الخريطة.</em></h1><p>الرابط الذي فتحته غير موجود، لكن بقية المنظومة بانتظارك.</p>${actionLink('/','العودة إلى الرئيسية','light')}</div></section>`};
async function go(path,{replace=false,scroll=true}={}){if(!path)path='/';const url=new URL(path,location.origin);if(url.origin!==location.origin){location.assign(path);return}let pathname=url.pathname.replace(/\/$/,'')||'/';const old=pathname;if(aliases[pathname])pathname=aliases[pathname];if(old==='/tutorials'&&url.searchParams.get('tab')==='videos')pathname='/videos';if(old==='/guide'&&url.searchParams.get('tool'))pathname=`/tools/${encodeURIComponent(url.searchParams.get('tool'))}`;if(old==='/tutorials'&&url.searchParams.get('guide'))pathname=`/knowledge/guide/${encodeURIComponent(url.searchParams.get('guide'))}`;
const finalPath=pathname+((old===pathname||!['/tutorials','/guide'].includes(old))?url.search:'');const target=finalPath||'/';if(replace)history.replaceState({},'',target);else if(location.pathname+location.search!==target)history.pushState({},'',target);
let body;let behavior=pathname;
if(pathname==='/')body=home();
else if(pathname==='/app')body=appProduct();
else if(pathname==='/cloud')body=cloudProduct();
else if(pathname==='/knowledge')body=knowledge('guides');
else if(pathname==='/tools')body=knowledge('tools');
else if(pathname==='/videos')body=knowledge('videos');
else if(pathname.startsWith('/tools/'))body=toolDetail(decodeURIComponent(pathname.split('/').slice(2).join('/')));
else if(pathname.startsWith('/knowledge/guide/'))body=guideDetail(decodeURIComponent(pathname.split('/').slice(3).join('/')));
else if(pathname==='/services')body=services();
else if(pathname==='/contact')body=contact();
else if(pathname==='/faq')body=faq();
else if(authRoutes.has(pathname)){if(state.me?.customer&&['/register','/customer-login'].includes(pathname)){go('/account',{replace:true});return}body=authView(pathname)}
else if(pathname==='/account')body=accountShell();
else body=notFound();
container.innerHTML=frame(body,pathname); if(scroll)window.scrollTo({top:0,behavior:'instant'});
setupNavigation();if(['/knowledge','/tools','/videos'].includes(pathname))libraryInteractions(pathname==='/knowledge'?'guides':pathname.slice(1));if(authRoutes.has(pathname))authEvents(pathname,(u)=>go(u));if(pathname==='/account'){accountEvents();await openAccount();}
if(pathname==='/'){document.querySelectorAll('[data-product]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-product]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b))});document.getElementById('product-stage').innerHTML=productStage(b.dataset.product)}))}
}
function setupNavigation(){const btn=document.getElementById('menu-button'),menu=document.getElementById('mobile-menu');btn?.addEventListener('click',()=>{const open=btn.getAttribute('aria-expanded')!=='true';btn.setAttribute('aria-expanded',String(open));menu.hidden=!open;document.body.classList.toggle('menu-open',open)})}
document.addEventListener('click',ev=>{const a=ev.target.closest('a[data-link]');if(!a||ev.defaultPrevented||ev.button!==0||ev.metaKey||ev.ctrlKey||ev.altKey||ev.shiftKey)return;if(a.origin!==location.origin)return;ev.preventDefault();document.body.classList.remove('menu-open');go(a.pathname+a.search+a.hash)});
window.addEventListener('popstate',()=>go(location.pathname+location.search,{replace:true,scroll:false}));
document.addEventListener('onstar:navigate',ev=>go(ev.detail,{replace:true}));
async function bootstrap(){try{
  await loadData();
  await go(location.pathname+location.search,{replace:true,scroll:false});
  // Public pages render immediately; a temporary API outage must not block marketing or help.
  if(location.pathname!=='/account')get('/me').then(user=>{
    state.me=user;state.meChecked=true;
    const link=document.querySelector('.head-cta .login-link');
    if(link){link.href='/account';link.textContent='لوحة التحكم'}
    const mobile=document.querySelector('.mobile-menu a:last-child');
    if(mobile){mobile.href='/account';mobile.innerHTML='لوحة المشترك <span>↖</span>'}
  }).catch(err=>{if(err.status===401||err.status===403){state.me=null;state.meChecked=true}});
 }catch(err){container.innerHTML=`<main class="boot-error"><h1>تعذر تحميل OnStar</h1><p>${e(err.message)}</p><button onclick="location.reload()">إعادة المحاولة</button></main>`}}
bootstrap();
