import React, { useEffect, useMemo, useState } from 'react'
import TutorialCard from '../components/TutorialCard.jsx'
import { tutorials, tutorialCategories } from '../data/tutorials.js'
import { platformGuides, platformCategories, getPlatformGuide } from '../data/platformGuides.js'
import '../styles/platform-tutorials.css'

const getLocationState = () => {
  const params = new URLSearchParams(window.location.search)
  const guide = getPlatformGuide(params.get('guide'))
  return {
    mode: guide || params.get('tab') !== 'videos' && !params.get('category') ? 'platform' : 'videos',
    selectedId: guide?.id || null,
    category: params.get('category') || 'all',
  }
}

function PlatformArticle({ guide, onBack, onChoose }) {
  const cat = platformCategories.find(c => c.id === guide.category)
  const related = platformGuides.filter(g => g.id !== guide.id && g.category === guide.category).slice(0, 3)
  return <section className="section platform-reading-section">
    <div className="container">
      <div className="platform-reading-layout">
        <article className="platform-article">
          <button type="button" className="platform-back" onClick={onBack}>→ العودة إلى جميع الشروحات</button>
          <div className="platform-article-meta"><span>{cat?.icon} {cat?.title}</span><span>{guide.audience}</span><span>{guide.steps.length} خطوات</span></div>
          <h1>{guide.title}</h1>
          <p className="platform-article-lead">{guide.intro}</p>
          <h2>طريقة الاستخدام خطوة بخطوة</h2>
          <ol className="platform-steps">{guide.steps.map((step, i) => <li key={i}><span className="platform-step-index">{String(i + 1).padStart(2, '0')}</span><p>{step}</p></li>)}</ol>
          <div className="platform-result"><span aria-hidden="true">✓</span><div><h3>النتيجة المتوقعة</h3><p>{guide.result}</p></div></div>
          {guide.notes?.length > 0 && <div className="platform-important"><h3>ملاحظات قبل التنفيذ</h3><ul>{guide.notes.map((note, i) => <li key={i}>{note}</li>)}</ul></div>}
          <p className="platform-audience-hint">تظهر الميزات بحسب نوع الحساب وصلاحياته والإصدار المتاح. هذا شرح لاستخدام الواجهة، وليس تعليمات لإدارة البنية الداخلية للخدمة.</p>
        </article>
        <aside className="platform-aside"><div className="platform-aside-inner"><span className="platform-aside-eyebrow">واصل التعلّم</span><h2>شروحات مرتبطة</h2>{related.map(g => <button key={g.id} onClick={() => onChoose(g.id)}><span>{g.icon}</span><b>{g.title}</b><span aria-hidden="true">↗</span></button>)}<div className="platform-aside-help"><strong>لم تظهر الأداة في حسابك؟</strong><p>قد تكون مخصصة للإدارة أو تحتاج إلى صلاحية إضافية. يمكنك التواصل مع الدعم لمعرفة الأدوات المفعلة لك.</p></div></div></aside>
      </div>
    </div>
  </section>
}

export default function Tutorials() {
  const [initial] = useState(getLocationState)
  const [mode, setMode] = useState(initial.mode)
  const [category, setCategory] = useState(initial.category)
  const [selectedId, setSelectedId] = useState(initial.selectedId)
  const [query, setQuery] = useState('')
  const visibleVideos = useMemo(() => tutorials.filter(t => t.enabled !== false), [])
  const selected = getPlatformGuide(selectedId)

  useEffect(() => {
    const onPopstate = () => {
      const next = getLocationState()
      setMode(next.mode)
      setCategory(next.category)
      setSelectedId(next.selectedId)
    }
    window.addEventListener('popstate', onPopstate)
    return () => window.removeEventListener('popstate', onPopstate)
  }, [])

  const switchMode = next => {
    setMode(next); setSelectedId(null); setCategory('all'); setQuery('')
    window.history.pushState({}, '', next === 'videos' ? '/tutorials?tab=videos' : '/tutorials')
  }
  const openGuide = id => {
    setSelectedId(id)
    window.history.pushState({}, '', `/tutorials?guide=${encodeURIComponent(id)}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const backToGuides = () => {
    setSelectedId(null)
    window.history.pushState({}, '', '/tutorials')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const search = query.trim().toLocaleLowerCase('ar')
  const filteredGuides = platformGuides.filter(g =>
    (category === 'all' || g.category === category) &&
    (!search || [g.title, g.summary, g.intro, g.keywords, ...g.steps, ...(g.notes || [])].join(' ').toLocaleLowerCase('ar').includes(search))
  )
  const filteredVideos = visibleVideos.filter(t =>
    (category === 'all' || t.category === category) &&
    (!search || `${t.title || ''} ${t.description || ''}`.toLocaleLowerCase('ar').includes(search))
  )
  const isPlatform = mode === 'platform'
  const activeCategories = isPlatform ? platformCategories : tutorialCategories
  const activeCategory = activeCategories.find(c => c.id === category)

  return <>
    <section className="page-hero tutorial-page-hero platform-tutorial-hero"><div className="container">
      <span className="eyebrow">OnStar Academy · مركز المساعدة</span>
      <h1>{selected ? 'دليل استخدام OnStar' : 'كل ما تحتاجه لإدارة شبكتك'}</h1>
      <p>شروحات عربية واضحة للمميزات والاستخدام اليومي، مع مكتبة الفيديوهات الأصلية. خطوات عملية دون عرض تفاصيل تشغيل الخدمة الخاصة.</p>
      <div className="platform-mode-tabs" role="group" aria-label="نوع الشروحات">
        <button type="button" className={isPlatform ? 'active' : ''} aria-pressed={isPlatform} onClick={() => switchMode('platform')}><span aria-hidden="true">▤</span><span><b>شروحات لوحة الأجهزة</b><small>{platformGuides.length} دليل خطوة بخطوة</small></span></button>
        <button type="button" className={!isPlatform ? 'active' : ''} aria-pressed={!isPlatform} onClick={() => switchMode('videos')}><span aria-hidden="true">▶</span><span><b>شروحات الفيديو</b><small>{visibleVideos.length} فيديو متاح</small></span></button>
      </div>
    </div></section>
    {selected && isPlatform ? <PlatformArticle guide={selected} onBack={backToGuides} onChoose={openGuide} /> :
    <section className="section platform-tutorial-library"><div className="container">
      {isPlatform && !query && category === 'all' && <div className="platform-welcome"><div><span>ابدأ من هنا</span><h2>من أول دخول حتى إدارة الأجهزة باحتراف</h2><p>اختر موضوعًا، واتبع الخطوات داخل الدليل. تجد شروحات خاصة بالعملاء وأخرى مخصصة لمسؤولي الشبكات.</p></div><button type="button" onClick={() => openGuide('what-is-onstar')}>ابدأ الدليل <span aria-hidden="true">←</span></button></div>}
      <div className="platform-search"><span aria-hidden="true">⌕</span><input type="search" aria-label="البحث في الشروحات" value={query} onChange={e => setQuery(e.target.value)} placeholder={isPlatform ? 'ابحث: فتح عن بعد، Ping، الحماية، التخزين، كلمة المرور...' : 'ابحث في الفيديوهات: السرعات، التصميم، MikroTik...'} /></div>
      <div className="filter-row platform-filters" aria-label="أقسام الشروحات">
        <button type="button" className={category === 'all' ? 'active' : ''} onClick={() => setCategory('all')}>جميع الأقسام <small>{isPlatform ? platformGuides.length : visibleVideos.length}</small></button>
        {activeCategories.map(c => <button type="button" key={c.id} className={category === c.id ? 'active' : ''} onClick={() => setCategory(c.id)}>{c.icon} {c.title}</button>)}
      </div>
      <div className="results-head platform-results-head"><div><h2>{category === 'all' ? (isPlatform ? 'دليل مميزات لوحة الأجهزة' : 'مكتبة الفيديوهات') : activeCategory?.title}</h2><p>{category === 'all' ? (isPlatform ? 'شرح وظيفة كل ميزة، خطوات استخدامها، والنتيجة المتوقعة.' : 'الفيديوهات التعليمية المنشورة مسبقًا، دون أي تغيير في روابطها.') : activeCategory?.description}</p></div><span>{isPlatform ? filteredGuides.length : filteredVideos.length} {isPlatform ? 'شرح' : 'فيديو'}</span></div>
      {isPlatform ? filteredGuides.length ? <div className="platform-guide-grid">
        {filteredGuides.map(g => {const group = platformCategories.find(c => c.id === g.category); return <button type="button" key={g.id} className="platform-guide-card" onClick={() => openGuide(g.id)}><div className="platform-guide-card-top"><span className="platform-guide-icon">{g.icon}</span><span className="platform-guide-group">{group?.title}</span></div><h3>{g.title}</h3><p>{g.summary}</p><div className="platform-guide-card-foot"><small>{g.audience} · {g.steps.length} خطوات</small><b>اقرأ الشرح ←</b></div></button>})}
      </div> : <div className="empty-state"><b>لم نجد شرحًا مطابقًا</b><p>جرّب كلمة أخرى أو اختر جميع الأقسام.</p></div> :
        filteredVideos.length ? <div className="tutorial-grid">{filteredVideos.map(t => <TutorialCard key={t.id} item={t} category={tutorialCategories.find(c => c.id === t.category)} />)}</div> : <div className="empty-state"><b>لا توجد فيديوهات مطابقة</b><p>جرّب كلمة بحث أخرى أو اختر قسمًا مختلفًا.</p></div>}
      <div className="platform-help-footer"><span aria-hidden="true">✦</span><p><strong>للمساعدة في الاستخدام:</strong> اختر الدليل الخاص بالميزة أولًا. إذا كانت أداة لا تظهر لك، فتحقق من صلاحيات حسابك أو تواصل مع إدارة الخدمة. لا ترسل كلمات المرور أو بيانات الوصول الخاصة.</p></div>
    </div></section>}
  </>
}
