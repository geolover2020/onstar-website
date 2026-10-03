import React, { useEffect, useMemo, useState } from 'react'
import { customerApi, postJson } from '../lib/customerApi.js'

const serviceLabels={inactive:'غير مفعلة',trial_pending:'التجربة بانتظار الموافقة',trial_active:'تجربة مجانية',trial_expired:'انتهت التجربة',active:'نشطة',grace:'فترة سماح',suspended:'موقوفة',cancelled:'ملغاة'}
const financialLabels={no_invoice:'لا توجد فاتورة',pending:'بانتظار الدفع',paid:'مدفوع',partial:'دفع جزئي',credit:'آجل',overdue:'متأخر'}

function StatusCard({title,value,sub,tone=''}){return <div className={`account-stat ${tone}`}><small>{title}</small><strong>{value}</strong>{sub&&<span>{sub}</span>}</div>}

export default function CustomerAccount({ navigate }) {
  const [data,setData]=useState(null); const [loading,setLoading]=useState(true); const [error,setError]=useState(''); const [action,setAction]=useState('')
  const [pay,setPay]=useState({depositor_name:'',transaction_number:'',amount:'',deposit_date:'',message:''}); const [receipt,setReceipt]=useState(null)
  const router=data?.router
  const canTrial=useMemo(()=>Boolean(data?.trial?.can_request),[data])

  async function load(){setLoading(true);setError('');try{setData(await customerApi('/me'))}catch(err){if(err.status===401){navigate('/customer-login');return}setError(err.message)}finally{setLoading(false)}}
  useEffect(()=>{load()},[])
  async function logout(){try{await postJson('/logout',{})}catch{}navigate('/customer-login')}
  async function requestTrial(){setAction('trial');setError('');try{await postJson('/trial/request',{});await load()}catch(err){setError(err.message)}finally{setAction('')}}
  async function submitPayment(e){e.preventDefault();setAction('payment');setError('');try{const fd=new FormData();Object.entries(pay).forEach(([k,v])=>fd.append(k,v));if(receipt)fd.append('receipt',receipt);await customerApi('/payment-confirmations',{method:'POST',body:fd});setPay({depositor_name:'',transaction_number:'',amount:'',deposit_date:'',message:''});setReceipt(null);await load()}catch(err){setError(err.message)}finally{setAction('')}}
  if(loading)return <section className="auth-page"><div className="container"><div className="auth-card"><h2>جارٍ تحميل حسابك...</h2></div></div></section>
  if(error&&!data)return <section className="auth-page"><div className="container"><div className="auth-card"><h2>تعذر تحميل الحساب</h2><div className="form-error">{error}</div><button className="btn btn-ghost" onClick={load}>إعادة المحاولة</button></div></div></section>

  const trial=data?.trial||{}; const sub=data?.subscription||{}; const finance=data?.financial||{}; const service=data?.service||{}
  return <section className="account-page"><div className="container">
    <div className="account-head"><div><span className="eyebrow">بوابة المشترك</span><h1>{data.customer?.network_name||data.customer?.full_name||'حساب OnStar'}</h1><p>{data.customer?.email}</p></div><button className="btn btn-ghost" onClick={logout}>تسجيل الخروج</button></div>
    {error&&<div className="form-error account-error">{error}</div>}
    <div className="account-stats"><StatusCard title="حالة الخدمة" value={serviceLabels[service.status]||service.status||'غير مفعلة'} sub={service.suspend_at?`موعد الإيقاف: ${service.suspend_at}`:''} tone={service.status==='active'||service.status==='trial_active'?'good':''}/><StatusCard title="الحالة المالية" value={financialLabels[finance.status]||finance.status||'لا توجد فاتورة'} sub={finance.balance_due?`المستحق: ${finance.balance_due}`:''}/><StatusCard title="MikroTik" value={router?.connected?'متصل':'غير مرتبط / غير متصل'} sub={router?.serial?`Serial: ${router.serial}`:'يُقرأ السيريال تلقائيًا بعد الربط'} tone={router?.connected?'good':''}/><StatusCard title="الاشتراك" value={sub.plan_name||'لم يبدأ'} sub={sub.paid_period_end?`حتى ${sub.paid_period_end}`:'الفترة المدفوعة لا تشمل أيام التجربة'}/></div>

    <div className="account-grid">
      <article className="account-panel"><div className="panel-title"><div><span className="eyebrow">التجربة المجانية</span><h2>تجربة بموافقة الإدارة</h2></div><span className="trial-days">{trial.default_days||5} أيام</span></div><p>التجربة لا تبدأ إلا بعد موافقة الإدارة، ولا تُخصم مدتها من اشتراكك المدفوع. الأهلية مرتبطة ببريدك المؤكد وSerial MikroTik الحقيقي.</p>{trial.status==='active'&&<div className="notice-box good">التجربة فعالة حتى {trial.ends_at}</div>}{trial.status==='pending'&&<div className="notice-box">طلب التجربة بانتظار مراجعة الإدارة.</div>}{trial.used&&trial.status!=='active'&&trial.status!=='pending'&&<div className="notice-box">تم استخدام التجربة المجانية لهذا البريد أو الراوتر سابقًا.</div>}{canTrial&&<button className="btn btn-primary" disabled={action==='trial'} onClick={requestTrial}>{action==='trial'?'جارٍ إرسال الطلب...':'طلب تجربة مجانية'}</button>}{!router?.serial&&<small className="panel-hint">يجب ربط MikroTik أولًا حتى يقرأ السيرفر Serial Number قبل اعتماد التجربة.</small>}</article>

      <article className="account-panel"><span className="eyebrow">الدفع المعتمد</span><h2>حساب الكريمي السعودي</h2><div className="bank-account-card inline"><small>رقم الحساب</small><strong className="mono">3027149935</strong></div><p>بعد الإيداع أرسل رقم العملية واسم المودع. إرسال التأكيد لا يفعّل الخدمة تلقائيًا؛ الإدارة تراجع العملية وتعتمدها من السيرفر.</p></article>
    </div>

    <div className="account-grid lower">
      <article className="account-panel"><span className="eyebrow">تأكيد الدفع</span><h2>إرسال بيانات عملية الكريمي</h2><form className="payment-form" onSubmit={submitPayment}><label>اسم المودع<input required value={pay.depositor_name} onChange={e=>setPay(x=>({...x,depositor_name:e.target.value}))}/></label><label>رقم العملية<input required value={pay.transaction_number} onChange={e=>setPay(x=>({...x,transaction_number:e.target.value}))}/></label><div className="form-two"><label>المبلغ<input required inputMode="decimal" value={pay.amount} onChange={e=>setPay(x=>({...x,amount:e.target.value}))}/></label><label>تاريخ الإيداع<input required type="date" value={pay.deposit_date} onChange={e=>setPay(x=>({...x,deposit_date:e.target.value}))}/></label></div><label>رسالة للإدارة<textarea value={pay.message} onChange={e=>setPay(x=>({...x,message:e.target.value}))} placeholder="أي تفاصيل تساعد الإدارة في مطابقة العملية..."/></label><label>صورة الإيصال — اختياري<input type="file" accept="image/*,.pdf" onChange={e=>setReceipt(e.target.files?.[0]||null)}/></label><button className="btn btn-primary" disabled={action==='payment'}>{action==='payment'?'جارٍ الإرسال...':'إرسال تأكيد الدفع'}</button></form></article>

      <article className="account-panel"><span className="eyebrow">آخر الطلبات</span><h2>متابعة المراجعة</h2><div className="customer-events">{(data.payment_confirmations||[]).length?(data.payment_confirmations||[]).slice(0,6).map(x=><div className="customer-event" key={x.id}><div><b>{x.transaction_number}</b><span>{x.depositor_name}</span></div><div><strong>{x.amount}</strong><small className={`status-pill ${x.status}`}>{x.status_label||x.status}</small></div></div>):<div className="empty-customer-state">لا توجد تأكيدات دفع مرسلة حتى الآن.</div>}</div></article>
    </div>
  </div></section>
}
