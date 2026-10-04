import React from 'react'
import SectionTitle from '../components/SectionTitle.jsx'

const benefits = [
  ['إدارة MikroTik عن بُعد', 'WinBox وSSH وFTP وAPI وWebFig من خارج الشبكة عبر حساب مخصص.'],
  ['حساب ثابت لكل شبكة', 'بيانات VPN وRemote Host والمنافذ تبقى ثابتة حتى عند التجديد أو إيقاف الخدمة مؤقتًا.'],
  ['تجربة مجانية بموافقة الإدارة', 'يمكن طلب تجربة مجانية افتراضيًا لمدة 5 أيام، ولا تبدأ إلا بعد موافقة الإدارة.'],
  ['حماية من تكرار التجربة', 'الأهلية مرتبطة ببريد إلكتروني مؤكد وSerial Number الحقيقي لـ MikroTik الذي يقرأه السيرفر.'],
  ['تفعيل مالي يدوي', 'تسجيل الحساب والطلب يتمان من الموقع، لكن تفعيل الخدمة المدفوعة لا يتم إلا بعد تأكيد الإدارة لعملية الدفع.'],
  ['إشعارات بريدية تلقائية', 'القبول والرفض والفواتير والدفع والتنبيهات المهمة تصل تلقائيًا إلى بريد المشترك.'],
]

export default function RemoteAccess({ navigate, auth }) {
  const logged=!!auth?.authenticated
  return <>
    <section className="page-hero remote-access-hero">
      <div className="container remote-hero-grid">
        <div>
          <span className="eyebrow">OnStar Remote Access</span>
          <h1>دخول آمن لأجهزة شبكتك<br/>مع اشتراك ومحاسبة واضحة</h1>
          <p>سجّل طلبك من الموقع، اربط MikroTik، واطلب تجربة مجانية أو أرسل تأكيد الدفع. بعد التفعيل تظهر لك عناوين Winbox وSSH وFTP وAPI وWebFig جاهزة للنسخ.</p>
          <div className="hero-buttons">
            {logged ? <button className="btn btn-primary" onClick={()=>navigate('/account')}>فتح حسابي</button> : <>
              <button className="btn btn-primary" onClick={()=>navigate('/register')}>إنشاء حساب مشترك</button>
              <button className="btn btn-ghost" onClick={()=>navigate('/customer-login')}>دخول</button>
            </>}
          </div>
        </div>
        <div className="remote-flow-card">
          <div className="remote-flow-step"><span>01</span><b>تسجيل الحساب</b><small>تأكيد البريد وإنشاء الحساب بدون تفعيل الخدمة.</small></div>
          <div className="remote-flow-step"><span>02</span><b>ربط MikroTik</b><small>السيرفر يقرأ Serial Number الحقيقي من الراوتر.</small></div>
          <div className="remote-flow-step"><span>03</span><b>تجربة أو دفع</b><small>طلب تجربة مجانية أو إرسال إثبات الدفع من الحساب.</small></div>
          <div className="remote-flow-step"><span>04</span><b>التفعيل والوصول</b><small>بعد موافقة الإدارة تظهر عناوين الوصول والمنافذ داخل الحساب.</small></div>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <SectionTitle eyebrow="كيف تعمل الخدمة" title="الحساب موجود دائمًا، والتفعيل حالة مستقلة" text="لا نحذف حساب VPN عند انتهاء التجربة أو التأخر في الدفع؛ يتم تعليق الخدمة فقط مع الاحتفاظ ببيانات الراوتر والمنافذ والحساب." center/>
        <div className="feature-grid remote-benefits">
          {benefits.map(([title,text],i)=><article className="feature-card" key={title}><div className="feature-no">0{i+1}</div><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </div>
    </section>

    <section className="section section-dark">
      <div className="container payment-public-panel">
        <div>
          <span className="eyebrow">وسيلة الدفع المعتمدة</span>
          <h2>الدفع عبر حساب الكريمي فقط</h2>
          <p>بعد الإيداع يرسل المشترك من حسابه اسم المودع ورقم العملية وتفاصيل الدفع. لا تعتبر العملية مدفوعة حتى تعتمدها الإدارة.</p>
        </div>
        <div className="bank-account-card">
          <small>الكريمي — الحساب السعودي</small>
          <strong className="mono">3027149935</strong>
          <span>يُرجى الاحتفاظ برقم العملية بعد الإيداع.</span>
        </div>
      </div>
    </section>
  </>
}
