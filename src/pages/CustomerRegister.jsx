import React, { useState } from 'react'
import { postJson } from '../lib/customerApi.js'

export default function CustomerRegister({ navigate }) {
  const [form,setForm]=useState({full_name:'',email:'',phone:'',network_name:'',password:'',password_confirm:''})
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState('')
  const [done,setDone]=useState(null)
  const set=(k,v)=>setForm(x=>({...x,[k]:v}))

  async function submit(e){
    e.preventDefault(); setError('')
    if(form.password.length<8){setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل.');return}
    if(form.password!==form.password_confirm){setError('تأكيد كلمة المرور غير مطابق.');return}
    setLoading(true)
    try{
      const result=await postJson('/register', {
        full_name:form.full_name.trim(), email:form.email.trim(), phone:form.phone.trim(), network_name:form.network_name.trim(), password:form.password
      })
      setDone(result)
    }catch(err){setError(err.message)}finally{setLoading(false)}
  }

  if(done) return <section className="auth-page"><div className="container"><div className="auth-card success-card"><span className="status-icon">✓</span><h1>تم إنشاء طلب الحساب</h1><p>أرسلنا تعليمات تأكيد البريد إلى <b>{form.email}</b>. بعد تأكيد البريد يمكنك الدخول ومتابعة طلب الخدمة.</p><div className="notice-box">إنشاء الحساب لا يعني تفعيل خدمة VPN. التفعيل يتم لاحقًا بعد موافقة الإدارة على التجربة أو تأكيد الدفع.</div><button className="btn btn-primary" onClick={()=>navigate('/customer-login')}>الانتقال لتسجيل الدخول</button></div></div></section>

  return <section className="auth-page"><div className="container auth-layout"><div className="auth-copy"><span className="eyebrow">حساب مشترك جديد</span><h1>ابدأ طلب خدمة OnStar Remote Access</h1><p>سنسجل بياناتك أولًا. بعد ذلك يمكنك ربط MikroTik وطلب تجربة مجانية أو إرسال تأكيد الدفع.</p><div className="auth-points"><span>✓ تأكيد البريد الإلكتروني</span><span>✓ التجربة بموافقة الإدارة</span><span>✓ لا يتم احتساب التجربة من الاشتراك المدفوع</span><span>✓ Serial MikroTik يُقرأ من الراوتر وليس من إدخال يدوي</span></div></div><form className="auth-card" onSubmit={submit}><h2>إنشاء الحساب</h2><label>الاسم الكامل<input required value={form.full_name} onChange={e=>set('full_name',e.target.value)} autoComplete="name"/></label><label>اسم الشبكة<input required value={form.network_name} onChange={e=>set('network_name',e.target.value)} placeholder="مثال: Star Net"/></label><label>البريد الإلكتروني<input required type="email" value={form.email} onChange={e=>set('email',e.target.value)} autoComplete="email"/></label><label>رقم الهاتف<input required value={form.phone} onChange={e=>set('phone',e.target.value)} inputMode="tel" autoComplete="tel"/></label><label>كلمة المرور<input required type="password" value={form.password} onChange={e=>set('password',e.target.value)} autoComplete="new-password"/></label><label>تأكيد كلمة المرور<input required type="password" value={form.password_confirm} onChange={e=>set('password_confirm',e.target.value)} autoComplete="new-password"/></label>{error&&<div className="form-error">{error}</div>}<button className="btn btn-primary full-btn" disabled={loading}>{loading?'جارٍ إنشاء الحساب...':'إنشاء الحساب'}</button><p className="form-foot">لديك حساب؟ <a href="/customer-login" onClick={e=>{e.preventDefault();navigate('/customer-login')}}>تسجيل الدخول</a></p></form></div></section>
}
