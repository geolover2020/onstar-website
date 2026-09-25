import React from 'react'
import SectionTitle from '../components/SectionTitle.jsx'
import { features, speedMethods } from '../data/content.js'

export default function Features({ navigate }){
  return <>
    <section className="page-hero"><div className="container"><span className="eyebrow">OnStar Features</span><h1>أدوات عملية صُممت لمدير الشبكة</h1><p>مجموعة خصائص مترابطة لتقليل الوقت بين تركيب الصفحة، إدارتها، فحص الشبكة، ومتابعة الأجهزة من الهاتف.</p></div></section>
    <section className="section"><div className="container"><div className="feature-grid large">{features.map(f=><article className="feature-card" key={f.title}><div className="icon-box app-icon"><img src={f.icon} alt=""/></div><h3>{f.title}</h3><p>{f.text}</p></article>)}</div></div></section>

    <section className="section speed-showcase"><div className="container">
      <SectionTitle eyebrow="إدارة السرعة" title="منظومة واحدة، خمس طرق مختلفة لتحديد السرعة" text="يدعم OnStar طرقًا تعمل بدومين وأخرى بدون دومين، حتى تختار الأسلوب الأنسب لبنية الشبكة بدل الالتزام بطريقة واحدة." center/>
      <div className="speed-methods-grid">{speedMethods.map((m,i)=><article key={m.title}><span>0{i+1}</span><h3>{m.title}</h3><p>{m.text}</p></article>)}</div>
      <div className="speed-switch-panel"><div><span className="eyebrow">تغيير النمط في أي وقت</span><h3>صفحة تحديد سرعة ↔ صفحة بدون تحديد سرعة</h3><p>يمكنك من إعدادات التطبيق تحويل الصفحة بين الوضعين متى احتجت، بدون إعادة بناء الصفحة من البداية.</p></div><div className="switch-visual"><b>بدون سرعة</b><span className="switch-track"><i/></span><b>تحديد السرعة</b></div></div>
    </div></section>

    <section className="section section-dark"><div className="container"><SectionTitle eyebrow="Workflow" title="من الصفحة إلى الشبكة بدون تبديل الأدوات" text="OnStar يجمع المهام الأكثر تكرارًا في تدفق عمل واضح."/><div className="process-grid">{[['01','ركّب واضبط صفحة HotSpot'],['02','اختر طريقة تحديد السرعة'],['03','وثّق أجهزة الشبكة'],['04','افحص الاتصال والحالة'],['05','احفظ نسخة احتياطية']].map(x=><div key={x[0]}><b>{x[0]}</b><h3>{x[1]}</h3></div>)}</div><button className="btn btn-primary" onClick={()=>navigate('/tutorials')}>شاهد الشروحات</button></div></section>
  </>
}
