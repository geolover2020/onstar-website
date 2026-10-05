import React from 'react'
import SectionTitle from '../components/SectionTitle.jsx'
import Disclosure from '../components/Disclosure.jsx'

const benefits = [
  ['إدارة MikroTik عن بُعد', 'WinBox وSSH وFTP وAPI وWebFig من خارج الشبكة عبر حساب مخصص.'],
  ['حساب ثابت لكل شبكة', 'بيانات VPN وRemote Host والمنافذ تبقى ثابتة حتى عند التجديد أو إيقاف الخدمة مؤقتًا.'],
  ['تجربة مجانية بموافقة الإدارة', 'يمكن طلب تجربة مجانية افتراضيًا لمدة 5 أيام، ولا تبدأ إلا بعد موافقة الإدارة.'],
  ['حماية من تكرار التجربة', 'الأهلية مرتبطة ببريد إلكتروني مؤكد وSerial Number الحقيقي لـ MikroTik الذي يقرأه السيرفر.'],
  ['تفعيل مالي يدوي', 'تسجيل الحساب والطلب يتمان من الموقع، لكن تفعيل الخدمة المدفوعة لا يتم إلا بعد تأكيد الإدارة لعملية الدفع.'],
  ['إشعارات بريدية تلقائية', 'القبول والرفض والفواتير والدفع والتنبيهات المهمة تصل تلقائيًا إلى بريد المشترك.'],
]

const detailedSteps=[
  {
    badge:'01', title:'إنشاء الحساب وتأكيد البريد', subtitle:'ابدأ من هنا قبل الدفع أو ربط الراوتر',
    body:<><p>أنشئ حسابًا باسم الشبكة وبريد صحيح، ثم أكّد البريد بالرمز المرسل إليك.</p><ol><li>افتح صفحة إنشاء الحساب وأدخل بيانات الشبكة.</li><li>اختر إصدار RouterOS الصحيح v6 أو v7.</li><li>استلم رمز البريد وأدخله في صفحة التحقق.</li><li>بعد نجاح التحقق ادخل إلى صفحة «حسابي».</li></ol><div className="instruction-tip">إذا لم يصل الرمز، استخدم زر «إرسال رمز جديد» من نفس الصفحة بدل إنشاء حساب ثانٍ.</div></>
  },
  {
    badge:'02', title:'التحقق من MikroTik', subtitle:'قراءة Serial Number وSoftware ID من الراوتر نفسه',
    body:<><p>هذه الخطوة تثبت أن الراوتر مربوط بالحساب الصحيح وتمنع تكرار التجربة على نفس الجهاز.</p><ol><li>من حسابك اضغط «إنشاء كود التحقق».</li><li>انسخ الكود كاملًا بدون تعديل.</li><li>افتح Terminal في MikroTik والصق الكود.</li><li>انتظر ظهور <b>ONSTAR_VERIFY_OK</b>.</li><li>ارجع للموقع واضغط تحديث الحالة.</li></ol><div className="instruction-tip">لا تكتب Serial Number يدويًا. OnStar يقرأه مباشرة من RouterOS.</div></>
  },
  {
    badge:'03', title:'التجربة المجانية أو الدفع', subtitle:'اختر المسار المناسب بدون تداخل بينهما',
    body:<><p>بعد التحقق يمكنك طلب تجربة مجانية إذا كنت مؤهلًا، أو اختيار الباقة وإنشاء فاتورة.</p><ol><li>للتجربة: اضغط «طلب تجربة مجانية» وانتظر موافقة الإدارة.</li><li>للاشتراك: اختر الباقة ثم أنشئ الفاتورة.</li><li>بعد الإيداع، أرسل اسم المودع ورقم العملية والمبلغ.</li><li>يمكنك إرفاق صورة أو PDF للإيصال.</li><li>الخدمة تتفعل بعد اعتماد الإدارة، وليس بمجرد إرسال الطلب.</li></ol></>
  },
  {
    badge:'04', title:'تشغيل اتصال Remote VPN', subtitle:'كود واحد يولده السيرفر لحساب شبكتك',
    body:<><p>بعد قبول التجربة أو أول دفعة يتم إنشاء بيانات VPN ثابتة للشبكة.</p><ol><li>اضغط «عرض كود اتصال VPN» من حسابك.</li><li>انسخ الكود إلى MikroTik Terminal.</li><li>تأكد أن واجهة الاتصال أصبحت Running.</li><li>حدّث الحساب وستظهر عناوين الدخول والمنافذ العامة.</li></ol><div className="instruction-tip">الكود خاص باتصال VPN فقط ولا يغير مستخدمي HotSpot أو إعدادات الشبكة الداخلية الأخرى.</div></>
  },
  {
    badge:'05', title:'ضبط منافذ API وFTP وSSH الداخلية', subtitle:'استخدمها عندما تكون /ip service مختلفة عن الافتراضي',
    body:<><p>المنافذ العامة تبقى ثابتة، بينما تستطيع تعديل المنفذ الداخلي الحقيقي لكل خدمة.</p><ol><li>في MikroTik نفّذ <b>/ip service print</b>.</li><li>اقرأ منافذ api وftp وssh.</li><li>في الموقع افتح «منافذ MikroTik الداخلية».</li><li>أدخل القيم واضغط «حفظ ومزامنة المنافذ».</li><li>OnStar يعيد بناء التحويلات ويحدث منفذ API المستخدم للإدارة.</li></ol><div className="instruction-tip">لا تستخدم نفس رقم المنفذ لخدمتين مختلفتين.</div></>
  },
  {
    badge:'06', title:'جلب الاتصال داخل تطبيق OnStar Cloud', subtitle:'بدون كتابة Host والمنافذ يدويًا كل مرة',
    body:<><p>من شاشة تسجيل الدخول في تطبيق OnStar استخدم زر «جلب من OnStar Cloud».</p><ol><li>انسخ «اسم حساب OnStar Cloud» من صفحة حسابك.</li><li>في التطبيق اضغط زر الجلب من Cloud.</li><li>أدخل اسم الحساب فقط.</li><li>سيتم تعبئة Host وAPI وFTP وSSH العامة تلقائيًا.</li><li>أدخل Username وPassword الخاصين بـMikroTik يدويًا ثم سجل الدخول.</li></ol><div className="instruction-tip">السيرفر لا يرسل كلمة مرور MikroTik أو أي Secret إلى التطبيق.</div></>
  },
]

export default function RemoteAccess({ navigate, auth }) {
  const logged=!!auth?.authenticated
  return <>
    <section className="page-hero remote-access-hero premium-page-hero">
      <div className="container remote-hero-grid">
        <div>
          <span className="eyebrow">OnStar Remote Access</span>
          <h1>دخول آمن لأجهزة شبكتك<br/><span className="gradient-text">من أي مكان وبخطوات واضحة</span></h1>
          <p>سجّل الطلب، اربط MikroTik، فعّل التجربة أو الاشتراك، ثم استخدم عناوين الدخول والمنافذ الجاهزة من الموقع أو من تطبيق OnStar.</p>
          <div className="hero-buttons">
            {logged ? <button className="btn btn-primary" onClick={()=>navigate('/account')}>فتح حسابي</button> : <><button className="btn btn-primary" onClick={()=>navigate('/register')}>إنشاء حساب مشترك</button><button className="btn btn-ghost" onClick={()=>navigate('/customer-login')}>دخول</button></>}
          </div>
        </div>
        <div className="remote-flow-card premium-flow-card">
          <div className="remote-flow-step"><span>01</span><b>تسجيل الحساب</b><small>تأكيد البريد وإنشاء الحساب بدون تفعيل الخدمة.</small></div>
          <div className="remote-flow-step"><span>02</span><b>ربط MikroTik</b><small>قراءة Serial Number الحقيقي من الراوتر.</small></div>
          <div className="remote-flow-step"><span>03</span><b>تجربة أو دفع</b><small>طلب تجربة أو إرسال عملية الدفع.</small></div>
          <div className="remote-flow-step"><span>04</span><b>التفعيل والوصول</b><small>VPN + Host + Public Ports + Cloud App.</small></div>
        </div>
      </div>
    </section>

    <section className="section execution-guide-section">
      <div className="container">
        <SectionTitle eyebrow="التنفيذ خطوة بخطوة" title="افتح الشرح الذي تحتاجه فقط" text="كل جزء من الرحلة موجود داخل قائمة منسدلة مستقلة، مع التعليمات التي تنفذها فعليًا على الموقع أو MikroTik أو التطبيق." center/>
        <div className="execution-accordion">{detailedSteps.map((step,i)=><Disclosure key={step.title} badge={step.badge} title={step.title} subtitle={step.subtitle} defaultOpen={i===0}>{step.body}</Disclosure>)}</div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <SectionTitle eyebrow="كيف تعمل الخدمة" title="الحساب موجود دائمًا، والتفعيل حالة مستقلة" text="لا نحذف حساب VPN عند انتهاء التجربة أو التأخر في الدفع؛ يتم تعليق الخدمة فقط مع الاحتفاظ ببيانات الراوتر والمنافذ والحساب." center/>
        <div className="feature-grid remote-benefits">{benefits.map(([title,text],i)=><article className="feature-card premium-card" key={title}><div className="feature-no">0{i+1}</div><h3>{title}</h3><p>{text}</p></article>)}</div>
      </div>
    </section>

    <section className="section section-dark">
      <div className="container payment-public-panel">
        <div><span className="eyebrow">وسيلة الدفع المعتمدة</span><h2>الدفع عبر حساب الكريمي فقط</h2><p>بعد الإيداع يرسل المشترك من حسابه اسم المودع ورقم العملية وتفاصيل الدفع. لا تعتبر العملية مدفوعة حتى تعتمدها الإدارة.</p></div>
        <div className="bank-account-card"><small>الكريمي — الحساب السعودي</small><strong className="mono">3027149935</strong><span>يُرجى الاحتفاظ برقم العملية بعد الإيداع.</span></div>
      </div>
    </section>
  </>
}
