import React, { useMemo, useState } from 'react'
import TutorialCard from '../components/TutorialCard.jsx'
import { tutorials, tutorialCategories } from '../data/tutorials.js'

export default function Tutorials(){
  const params = new URLSearchParams(window.location.search)
  const initial = params.get('category') || 'all'
  const [category,setCategory] = useState(initial)
  const [query,setQuery] = useState('')
  const visible = useMemo(()=>tutorials.filter(t=>t.enabled!==false),[])
  const filtered = useMemo(()=>visible.filter(t => (category==='all'||t.category===category) && `${t.title||''} ${t.description||''}`.toLowerCase().includes(query.trim().toLowerCase())),[category,query,visible])
  const activeCategory=tutorialCategories.find(c=>c.id===category)
  return <><section className="page-hero tutorial-page-hero"><div className="container"><span className="eyebrow">OnStar Academy</span><h1>دليل شروحات OnStar</h1><p>ابحث عن الشرح، اختر القسم، وانتقل مباشرة إلى فيديو YouTube.</p><div className="search-box"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="ابحث: Ping، Queue Tree، نسخة احتياطية..."/></div></div></section><section className="section"><div className="container"><div className="filter-row"><button className={category==='all'?'active':''} onClick={()=>setCategory('all')}>الكل <small>{visible.length}</small></button>{tutorialCategories.map(c=><button key={c.id} className={category===c.id?'active':''} onClick={()=>setCategory(c.id)}>{c.icon} {c.title}</button>)}</div><div className="results-head"><div><h2>{category==='all'?'جميع الشروحات':activeCategory?.title}</h2>{activeCategory?.description&&<p>{activeCategory.description}</p>}</div><span>{filtered.length} شرح</span></div>{filtered.length?<div className="tutorial-grid">{filtered.map(t=><TutorialCard key={t.id} item={t} category={tutorialCategories.find(c=>c.id===t.category)}/>)}</div>:<div className="empty-state"><b>لا توجد نتائج</b><p>جرّب كلمة بحث أخرى أو اختر قسمًا مختلفًا.</p></div>}</div></section></>
}
