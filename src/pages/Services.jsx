import React from 'react'
import SectionTitle from '../components/SectionTitle.jsx'
import Icon from '../components/Icon.jsx'
import { teamServices, whatsapp } from '../data/content.js'

export default function Services(){
  return <>
    <section className="page-hero services-hero">
      <div className="container">
        <span className="eyebrow">خدمات الفريق البرمجي</span>
        <h1>خدمات تنفيذ وتهيئة للشبكة<br/>خارج نطاق تطبيق OnStar</h1>
        <p>هذه الخدمات يقدمها الفريق البرمجي بشكل مستقل عن مميزات التطبيق، لمن يريد تركيبًا أو برمجة أو تهيئة احترافية للشبكة.</p>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <SectionTitle eyebrow="خدمات مستقلة" title="ننفذ لك الجزء الفني عندما تحتاجه" text="OnStar هو منتج مستقل، بينما الخدمات التالية أعمال فنية يقدمها الفريق حسب احتياج كل شبكة." center/>
        <div className="services-grid">
          {teamServices.map((s,i)=><article className="service-card" key={s.title}>
            <div className="service-icon"><Icon name={s.icon} size={30}/></div>
            <span className="service-index">0{i+1}</span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </article>)}
        </div>
      </div>
    </section>

    <section className="section section-dark">
      <div className="container service-detail-grid">
        <div>
          <SectionTitle eyebrow="الدخول عن بُعد" title="وصول إداري متكامل إلى MikroTik" text="يمكن تجهيز طرق الوصول المناسبة لإدارة الراوتر عن بُعد، مع مراعاة بنية الشبكة وطريقة الحماية المستخدمة."/>
          <div className="protocol-chips">
            {['WinBox','API','SSH','FTP','Web'].map(x=><span key={x}>{x}</span>)}
          </div>
        </div>
        <div className="service-terminal">
          <div className="terminal-head"><span/><span/><span/><b>MikroTik Remote Access</b></div>
          <code>WinBox  ✓</code><code>API     ✓</code><code>SSH     ✓</code><code>FTP     ✓</code><code>Web     ✓</code>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container cta-panel">
        <div><span className="eyebrow">تحتاج تنفيذًا فنيًا؟</span><h2>تواصل مع الفريق وحدد المطلوب لشبكتك</h2><p>اشرح بنية الشبكة والخدمة المطلوبة، وسيتم تحديد طريقة التنفيذ المناسبة.</p></div>
        <div className="cta-actions"><a className="btn btn-primary" href={whatsapp.developer} target="_blank" rel="noreferrer">التواصل مع الفريق</a></div>
      </div>
    </section>
  </>
}
