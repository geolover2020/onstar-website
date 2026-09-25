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
          <h1>دعم شبكتك الفني<br/><span>داخل جوالك.</span></h1>
          <p>بعد تركيب الصفحة وضبط الاتصال الأولي، يجمع OnStar أدوات إدارة HotSpot وMikroTik وأجهزة الشبكة في تطبيق واحد، لتنجز أعمالك اليومية من الهاتف دون الرجوع إلى اللابتوب في كل مرة.</p>
          <div className="hero-buttons"><button className="btn btn-primary" onClick={()=>navigate('/guide')}>استكشف دليل الأدوات</button><button className="btn btn-ghost" onClick={()=>navigate('/tutorials')}>دليل الفيديوهات <span>←</span></button></div>
          <div className="hero-trust"><span>✓ المعالجة الأساسية على الهاتف</span><span>✓ لا توجد خدمة دائمة داخل RouterOS</span><span>✓ شروحات لكل أداة</span></div>
        </div>
        <AppMockup />
      </div>
    </section>

    <section className="brand-strip"><div className="container strip-items">{['HotSpot','Network Manager','Ping Scanner','MikroTik Tools','Backup','User Manager'].map(x=><span key={x}>{x}</span>)}</div></section>

    <section className="section"><div className="container"><SectionTitle eyebrow="منصة واحدة" title="كل أدواتك الأساسية في مكان واحد" text="صمّم الصفحة، راقب الشبكة، افحص الأجهزة، ونظّم أعمالك اليومية من واجهة موحدة." center/><div className="feature-grid">{features.map((f,i)=><article className="feature-card" key={f.title}><div className="icon-box app-icon"><img src={f.icon} alt=""/></div><h3>{f.title}</h3><p>{f.text}</p><span className="feature-no">0{i+1}</span></article>)}</div></div></section>

    <section className="section performance-section"><div className="container">
      <SectionTitle eyebrow="الأداء والاعتمادية" title="OnStar لا يحوّل MikroTik إلى جهاز يشغّل التطبيق" text="تم تصميم التطبيق بحيث تبقى واجهته ومعالجة بياناته وملفاته على الهاتف، بينما يتعامل مع MikroTik فقط عند الحاجة لتنفيذ إعداد تختاره أنت." center/>
      <div className="performance-flow">
        <article><span className="flow-no">01</span><img src="/app-assets/ic_onstar.png" alt="OnStar"/><h3>المعالجة داخل الهاتف</h3><p>إدارة التصاميم، ملفات الصفحة، النسخ الاحتياطي، البحث، الشروحات وقواعد بيانات التطبيق تتم داخل الهاتف.</p></article>
        <article><span className="flow-no">02</span><img src="/app-assets/ic_mikrotik_tools.webp" alt="MikroTik"/><h3>إرسال الإعداد عند الطلب</h3><p>عند استخدام أداة MikroTik، يرسل OnStar الأوامر أو الإعدادات اللازمة عبر الاتصال بالراوتر، ثم ينتهي دور التطبيق في تلك العملية.</p></article>
        <article><span className="flow-no">03</span><img src="/app-assets/ic_security.webp" alt="RouterOS"/><h3>RouterOS يطبق القاعدة فقط</h3><p>أي Queue أو Firewall أو Mangle تضيفها تعمل داخل RouterOS كإعداد عادي. الحمل - إن وجد - يعتمد على القاعدة وحجم الشبكة، وليس على تشغيل OnStar نفسه.</p></article>
      </div>
      <div className="performance-note"><b>الخلاصة:</b> لا يتم تثبيت OnStar داخل MikroTik ولا توجد عملية خلفية من التطبيق تستهلك CPU الراوتر بشكل مستمر.</div>
    </div></section>

    <section className="section pocket-support"><div className="container split-layout">
      <div className="support-phone-card"><img src="/app-assets/ic_onstar.png" alt="OnStar"/><div><span>OnStar v3</span><strong>مساعد شبكتك في جيبك 24/7</strong><small>أدوات + إرشادات + شروحات + إدارة من الهاتف</small></div></div>
      <div><SectionTitle eyebrow="الهدف من OnStar" title="أقل اعتمادًا على اللابتوب، وأكثر قدرة على حل المشكلة من مكانك" text="بعد تركيب الصفحة وتجهيز الاتصال، الهدف أن يكون صاحب الشبكة قادرًا على إجراء التعديلات اليومية والفحص والصيانة من هاتفه مباشرة، حتى لو لم يكن معتادًا على كتابة أوامر MikroTik يدويًا."/>
      <div className="check-grid">{['تعديل الصفحة من الهاتف','فحص أجهزة الشبكة','نسخ واستعادة الإعدادات','أدوات MikroTik بواجهات واضحة','دليل لكل أداة','فيديوهات شرح مرتبطة'].map(x=><span key={x}>✓ {x}</span>)}</div>
      <p className="support-clarity">مصطلح «24/7» هنا يعني أن أدوات المساعدة الذاتية متاحة معك دائمًا داخل الهاتف، وليس وعدًا بوجود موظف دعم بشري مباشر طوال اليوم.</p>
      </div>
    </div></section>

    <section className="section guide-preview"><div className="container"><SectionTitle eyebrow="دليل الاستخدام" title="كل أداة لها شرح واضح قبل أن تستخدمها" text="اعثر على الأداة بالاسم أو الوظيفة، وافهم ماذا تفعل وكيف تستخدمها قبل تطبيق أي تغيير." center/><div className="guide-preview-grid"><article><strong>100+</strong><span>أداة وواجهة تشغيلية</span></article><article><strong>10</strong><span>أقسام منظمة</span></article><article><strong>بحث</strong><span>بالاسم والوظيفة والتقنية</span></article></div><div className="center-action"><button className="btn btn-primary" onClick={()=>navigate('/guide')}>فتح دليل أدوات OnStar</button></div></div></section>

    <section className="section section-dark"><div className="container split-layout"><div><SectionTitle eyebrow="Network Manager" title="شبكتك كاملة، منظمة وقابلة للفحص" text="سجّل كل جهاز مع بياناته المهمة، ثم افحص حالته من التطبيق بدل الرجوع إلى قوائم وملفات منفصلة."/><div className="check-grid">{['IP و VLAN','النوع والمنطقة','Ping مباشر','فحص Range','إحصائيات','نسخ احتياطي'].map(x=><span key={x}>✓ {x}</span>)}</div><button className="btn btn-primary" onClick={()=>navigate('/network')}>اكتشف إدارة الشبكة</button></div><div className="dashboard-card"><div className="dash-head"><span>Network overview</span><b>Live</b></div><div className="dash-kpis"><div><strong>142</strong><small>إجمالي الأجهزة</small></div><div><strong>92%</strong><small>متصل الآن</small></div></div><div className="chart-bars">{[58,82,46,92,70,88,64,95,76].map((h,i)=><i key={i} style={{height:`${h}%`}}/> )}</div><div className="dash-legend"><span>Access Points</span><span>Antennas</span><span>Others</span></div></div></div></section>

    <section className="section"><div className="container"><SectionTitle eyebrow="OnStar Academy" title="تعلم التطبيق خطوة بخطوة" text="مكتبة فيديوهات مرتبة حسب الأقسام، مع وصول مباشر إلى الشرح الذي تحتاجه." center/><div className="category-pills">{tutorialCategories.map(c=><button key={c.id} onClick={()=>navigate(`/tutorials?category=${c.id}`)}>{c.icon} {c.title}</button>)}</div><div className="tutorial-grid home-tutorials">{tutorials.slice(0,6).map(t=><TutorialCard key={t.id} item={t} category={tutorialCategories.find(c=>c.id===t.category)}/>)}</div><div className="center-action"><button className="btn btn-ghost" onClick={()=>navigate('/tutorials')}>عرض جميع الشروحات</button></div></div></section>

    <section className="section stats-section"><div className="container stats-grid">{stats.map(s=><div key={s.label}><strong>{s.value}</strong><span>{s.label}</span></div>)}</div></section>

    <section className="section"><div className="container cta-panel"><div><span className="eyebrow">مجتمع OnStar</span><h2>ابقَ قريبًا من التحديثات والشروحات</h2><p>انضم إلى مجموعة التطبيق أو تواصل مباشرة مع المطور للاستفسارات الفنية.</p></div><div className="cta-actions"><a className="btn btn-primary" href={whatsapp.group} target="_blank" rel="noreferrer">الانضمام إلى الجروب</a><a className="btn btn-ghost" href={whatsapp.developer} target="_blank" rel="noreferrer">التواصل مع المطور</a></div></div></section>
  </>
}
