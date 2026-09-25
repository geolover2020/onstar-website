import React,{useMemo,useState} from 'react'
import SectionTitle from '../components/SectionTitle.jsx'
import Icon from '../components/Icon.jsx'
import {tools,toolCategories,toolCount} from '../data/tools.js'

const categoryVisual={
 'start':'/app-assets/ic_onstar.png',
 'login-design':'/app-assets/ic_page_setup.webp',
 'speed':'/app-assets/ic_speed.webp',
 'content':'/app-assets/ic_news.webp',
 'mikrotik':'/app-assets/ic_mikrotik_tools.webp',
 'security':'/app-assets/ic_security.webp',
 'userman':'/app-assets/ic_usermanget_tool.webp',
 'files':'/app-assets/ic_addfile.webp',
 'network':'/app-assets/ic_accesspoint.webp',
 'notifications':'/app-assets/ic_notifications.webp'
}

const mikrotikCats=new Set(['mikrotik','security','speed','userman','network'])

export default function Guide(){
 const params=new URLSearchParams(location.search); const initial=params.get('tool')
 const [query,setQuery]=useState(''); const [cat,setCat]=useState('all'); const [selected,setSelected]=useState(()=>tools.find(t=>t.slug===initial)||null)
 const filtered=useMemo(()=>tools.filter(t=>(cat==='all'||t.category===cat)&&(!query||`${t.title} ${t.summary} ${(t.tags||[]).join(' ')}`.toLowerCase().includes(query.toLowerCase()))),[query,cat])
 const openTool=(t)=>{setSelected(t); history.replaceState({},'',`/guide?tool=${t.slug}`); document.body.classList.add('no-scroll')}
 const close=()=>{setSelected(null);history.replaceState({},'','/guide');document.body.classList.remove('no-scroll')}
 const cOf=id=>toolCategories.find(c=>c.id===id)
 const visualOf=(c)=>c?.image||categoryVisual[c?.id]||'/app-assets/ic_onstar.png'
 return <>
  <section className="page-hero guide-hero"><div className="container"><span className="eyebrow"><span className="dot"/> دليل OnStar الكامل</span><h1>شرح أدوات التطبيق <span>من داخل المشروع نفسه</span></h1><p>دليل قابل للبحث يشرح وظيفة كل أداة، ماذا تغيّر، وخطوات استخدامها. تم تنظيم الأدوات بالاعتماد على واجهات OnStar ومشروع إدارة أجهزة الشبكة.</p><div className="guide-kpis"><div><b>{toolCount}+</b><span>أداة وواجهة تشغيلية</span></div><div><b>{toolCategories.length}</b><span>أقسام رئيسية</span></div><div><b>RTL</b><span>شرح عربي منظم</span></div></div></div></section>
  <section className="section guide-section"><div className="container">
   <div className="guide-toolbar"><div className="guide-search"><Icon name="search" size={20}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="ابحث: Queue Tree، الأخبار، Ping، Port 53..."/></div><span className="result-count">{filtered.length} نتيجة</span></div>
   <div className="guide-cats"><button className={cat==='all'?'active':''} onClick={()=>setCat('all')}>الكل</button>{toolCategories.map(c=><button className={cat===c.id?'active':''} key={c.id} onClick={()=>setCat(c.id)}><Icon name={c.icon} size={18}/>{c.title}</button>)}</div>
   {cat==='all'&&!query && <div className="category-overview">{toolCategories.map(c=><article key={c.id} onClick={()=>setCat(c.id)}><div className="cat-icon">{c.image?<img src={c.image} alt=""/>:<Icon name={c.icon}/>}</div><div><h3>{c.title}</h3><p>{c.description}</p><small>{tools.filter(t=>t.category===c.id).length} أداة</small></div></article>)}</div>}
   <div className="tools-grid">{filtered.map(t=>{const c=cOf(t.category);return <article className="tool-card" key={t.slug} onClick={()=>openTool(t)}><div className="tool-card-top"><div className="cat-icon small">{c?.image?<img src={c.image} alt=""/>:<Icon name={c?.icon}/>}</div><span>{c?.title}</span></div><h3>{t.title}</h3><p>{t.summary}</p><div className="tool-tags">{(t.tags||[]).slice(0,3).map(x=><span key={x}>{x}</span>)}</div><button>فتح الشرح <Icon name="arrow" size={17}/></button></article>})}</div>
   {!filtered.length&&<div className="empty-state"><Icon name="search" size={40}/><h3>لا توجد نتيجة مطابقة</h3><p>جرّب كلمة أخرى أو اختر قسمًا مختلفًا.</p></div>}
  </div></section>
  {selected&&<div className="tool-modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&close()}><article className="tool-modal"><button className="modal-close" onClick={close}><Icon name="close"/></button><div className="modal-header"><div className="cat-icon original-tool-icon"><img src={selected.image||visualOf(cOf(selected.category))} alt=""/></div><div><span>{cOf(selected.category)?.title}</span><h2>{selected.title}</h2><code>{selected.activity}</code></div></div><p className="modal-lead">{selected.summary}</p>{selected.image&&<div className="tool-detail-image"><img src={selected.image} alt={selected.title}/></div>}{mikrotikCats.has(selected.category)&&<div className="router-impact-note"><b>كيف يتعامل OnStar مع MikroTik؟</b><span>الأداة تعمل من الهاتف وترسل الأمر أو الإعداد المطلوب إلى RouterOS. OnStar نفسه لا يعمل كخدمة داخل الراوتر. أي أثر على CPU يعتمد على إعداد RouterOS الذي تختار إنشاءه وحجم الشبكة.</span></div>}<div className="detail-block"><h3>ماذا تفعل الأداة؟</h3><p>{selected.what}</p></div><div className="detail-block"><h3>طريقة الاستخدام</h3><ol>{selected.steps.map((s,i)=><li key={i}>{s}</li>)}</ol></div>{selected.notes&&<div className="detail-block note"><h3>ملاحظات مهمة</h3><ul>{selected.notes.map((s,i)=><li key={i}>{s}</li>)}</ul></div>}{selected.video&&<a className="btn btn-primary video-link" target="_blank" rel="noreferrer" href={`https://www.youtube.com/watch?v=${selected.video}`}><Icon name="play" size={18}/> مشاهدة الشرح المرتبط</a>}</article></div>}
 </>
}
