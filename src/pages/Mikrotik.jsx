import React from 'react'
import SectionTitle from '../components/SectionTitle.jsx'
import { speedMethods } from '../data/content.js'

export default function Mikrotik({navigate}){
  const items=[['⚡','خمس طرق للسرعات','تحديد السرعة بدومين أو بدون دومين عبر خمس طرق تشمل Simple Queue وPCQ وQueue Tree وHotSpot.'],['🛡️','الحماية','أدوات HotSpot وDNS وبعض وسائل الحماية الشائعة.'],['👥','User Manager','شروحات الصيانة وجدولة حذف الكروت المنتهية.'],['🔧','الوصول للأجهزة','تسهيل الوصول لأجهزة Access Point والأجهزة الجديدة داخل الشبكة.']]
  return <>
    <section className="page-hero"><div className="container"><span className="eyebrow">MikroTik Toolkit</span><h1>أدوات مساعدة مصممة لبيئة MikroTik</h1><p>الهدف هو تسريع الأعمال اليومية وإتاحة الشرح المناسب لكل إعداد من الهاتف.</p></div></section>
    <section className="section"><div className="container"><SectionTitle title="الأدوات الرئيسية" center/><div className="feature-grid">{items.map(i=><article className="feature-card" key={i[1]}><div className="icon-box">{i[0]}</div><h3>{i[1]}</h3><p>{i[2]}</p></article>)}</div><div className="center-action"><button className="btn btn-primary" onClick={()=>navigate('/tutorials')}>فتح مكتبة الشروحات</button></div></div></section>
    <section className="section speed-showcase"><div className="container"><SectionTitle eyebrow="Speed Engine" title="اختر طريقة السرعة التي تناسب تصميم شبكتك" text="كل الطرق مجمعة داخل OnStar ويمكن الرجوع إلى الإعداد المناسب بدل إعادة بناء النظام من الصفر." center/><div className="speed-methods-grid">{speedMethods.map((m,i)=><article key={m.title}><span>0{i+1}</span><h3>{m.title}</h3><p>{m.text}</p></article>)}</div></div></section>
  </>
}
