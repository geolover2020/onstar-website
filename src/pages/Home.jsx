import React from 'react'
import AppMockup from '../components/AppMockup.jsx'
import SectionTitle from '../components/SectionTitle.jsx'
import TutorialCard from '../components/TutorialCard.jsx'
import { features, stats, whatsapp } from '../data/content.js'
import { tutorials, tutorialCategories } from '../data/tutorials.js'

export default function Home({ navigate }) {
  return <>
    <section className="hero">
      <div className="hero-grid-bg" />
      <div className="orb orb-1"/><div className="orb orb-2"/>
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow"><span className="dot"/> OnStar • الإصدار الثالث</span>
          <h1>إدارة شبكتك.<br/><span>أسرع، أوضح، وأذكى.</span></h1>
          <p>منصة أدوات متكاملة لإدارة صفحات MikroTik HotSpot، أجهزة الشبكة، السرعات، الفحص والحماية — من تطبيق واحد.</p>
          <div className="hero-buttons"><button className="btn btn-primary" onClick={()=>navigate('/features')}>استكشف المميزات</button><button className="btn btn-ghost" onClick={()=>navigate('/tutorials')}>دليل الشروحات <span>←</span></button></div>
          <div className="hero-trust"><span>✓ RTL عربي</span><span>✓ MikroTik HotSpot</span><span>✓ إدارة أجهزة الشبكة</span></div>
        </div>
        <AppMockup />
      </div>
    </section>

    <section className="brand-strip"><div className="container strip-items">{['HotSpot','Network Manager','Ping Scanner','MikroTik Tools','Backup','User Manager'].map(x=><span key={x}>{x}</span>)}</div></section>

    <section className="section"><div className="container"><SectionTitle eyebrow="منصة واحدة" title="كل أدواتك الأساسية في مكان واحد" text="صمّم الصفحة، راقب الشبكة، افحص الأجهزة، ونظّم أعمالك اليومية من واجهة موحدة." center/><div className="feature-grid">{features.map((f,i)=><article className="feature-card" key={f.title}><div className="icon-box">{f.icon}</div><h3>{f.title}</h3><p>{f.text}</p><span className="feature-no">0{i+1}</span></article>)}</div></div></section>

    <section className="section section-dark"><div className="container split-layout"><div><SectionTitle eyebrow="Network Manager" title="شبكتك كاملة، منظمة وقابلة للفحص" text="سجّل كل جهاز مع بياناته المهمة، ثم افحص حالته من التطبيق بدل الرجوع إلى قوائم وملفات منفصلة."/><div className="check-grid">{['IP و VLAN','النوع والمنطقة','Ping مباشر','فحص Range','إحصائيات','نسخ احتياطي'].map(x=><span key={x}>✓ {x}</span>)}</div><button className="btn btn-primary" onClick={()=>navigate('/network')}>اكتشف إدارة الشبكة</button></div><div className="dashboard-card"><div className="dash-head"><span>Network overview</span><b>Live</b></div><div className="dash-kpis"><div><strong>142</strong><small>إجمالي الأجهزة</small></div><div><strong>92%</strong><small>متصل الآن</small></div></div><div className="chart-bars">{[58,82,46,92,70,88,64,95,76].map((h,i)=><i key={i} style={{height:`${h}%`}}/> )}</div><div className="dash-legend"><span>Access Points</span><span>Antennas</span><span>Others</span></div></div></div></section>

    <section className="section"><div className="container"><SectionTitle eyebrow="OnStar Academy" title="تعلم التطبيق خطوة بخطوة" text="مكتبة فيديوهات مرتبة حسب الأقسام، مع وصول مباشر إلى الشرح الذي تحتاجه." center/><div className="category-pills">{tutorialCategories.map(c=><button key={c.id} onClick={()=>navigate(`/tutorials?category=${c.id}`)}>{c.icon} {c.title}</button>)}</div><div className="tutorial-grid home-tutorials">{tutorials.slice(0,6).map(t=><TutorialCard key={t.id} item={t} category={tutorialCategories.find(c=>c.id===t.category)}/>)}</div><div className="center-action"><button className="btn btn-ghost" onClick={()=>navigate('/tutorials')}>عرض جميع الشروحات</button></div></div></section>

    <section className="section stats-section"><div className="container stats-grid">{stats.map(s=><div key={s.label}><strong>{s.value}</strong><span>{s.label}</span></div>)}</div></section>

    <section className="section"><div className="container cta-panel"><div><span className="eyebrow">مجتمع OnStar</span><h2>ابقَ قريبًا من التحديثات والشروحات</h2><p>انضم إلى مجموعة التطبيق أو تواصل مباشرة مع المطور للدعم والاستفسارات الفنية.</p></div><div className="cta-actions"><a className="btn btn-primary" href={whatsapp.group} target="_blank" rel="noreferrer">الانضمام إلى الجروب</a><a className="btn btn-ghost" href={whatsapp.developer} target="_blank" rel="noreferrer">التواصل مع المطور</a></div></div></section>
  </>
}
