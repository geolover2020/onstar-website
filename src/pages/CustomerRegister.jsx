import React,{useEffect,useState} from 'react'
import {postJson} from '../lib/customerApi.js'

export default function CustomerRegister({navigate,auth}){
  useEffect(()=>{if(auth?.authenticated) navigate('/account')},[auth?.authenticated])
  const [form,setForm]=useState({full_name:'',network_name:'',email:'',phone:'',routeros_version:'7',password:'',password_confirm:''})
  const [loading,setLoading]=useState(false),[error,setError]=useState('')
  const set=(k,v)=>setForm(x=>({...x,[k]:v}))
  async function submit(e){
    e.preventDefault();setError('')
    if(form.password.length<8){setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل.');return}
    if(form.password!==form.password_confirm){setError('تأكيد كلمة المرور غير مطابق.');return}
    setLoading(true)
    try{
      const r=await postJson('/register',{full_name:form.full_name.trim(),network_name:form.network_name.trim(),email:form.email.trim(),phone:form.phone.trim(),routeros_version:form.routeros_version,password:form.password})
      localStorage.setItem('onstar_pending_email',form.email.trim())
      navigate(`/verify-email?email=${encodeURIComponent(form.email.trim())}&sent=${r.email_sent?'1':'0'}`)
    }catch(e){setError(e.message)}finally{setLoading(false)}
  }
  return <section className="auth-page"><div className="container auth-layout">
    <div className="auth-copy"><span className="eyebrow">OnStar Remote Access</span><h1>أنشئ حسابك قبل الدفع</h1><p>الحساب يسجل فورًا، لكن الخدمة تبقى غير مفعلة حتى توافق الإدارة على تجربة مجانية أو تعتمد عملية الدفع.</p><div className="auth-points"><span>✓ تحقق فعلي من البريد</span><span>✓ Serial MikroTik يُقرأ من الراوتر</span><span>✓ تجربة مجانية 5 أيام بعد موافقة الإدارة</span><span>✓ أيام التجربة لا تخصم من الاشتراك المدفوع</span></div></div>
    <form className="auth-card" onSubmit={submit}><h2>إنشاء حساب مشترك</h2>
      <label>الاسم الكامل<input required value={form.full_name} onChange={e=>set('full_name',e.target.value)} autoComplete="name"/></label>
      <label>اسم الشبكة<input required value={form.network_name} onChange={e=>set('network_name',e.target.value)} placeholder="مثال: Star Net"/></label>
      <label>البريد الإلكتروني<input required type="email" value={form.email} onChange={e=>set('email',e.target.value)} autoComplete="email"/></label>
      <label>رقم الهاتف<input required value={form.phone} onChange={e=>set('phone',e.target.value)} inputMode="tel" autoComplete="tel"/></label>
      <label>إصدار RouterOS<select value={form.routeros_version} onChange={e=>set('routeros_version',e.target.value)}><option value="7">RouterOS v7</option><option value="6">RouterOS v6</option></select></label>
      <label>كلمة المرور<input required type="password" value={form.password} onChange={e=>set('password',e.target.value)} autoComplete="new-password"/></label>
      <label>تأكيد كلمة المرور<input required type="password" value={form.password_confirm} onChange={e=>set('password_confirm',e.target.value)} autoComplete="new-password"/></label>
      {error&&<div className="form-error">{error}</div>}<button className="btn btn-primary full-btn" disabled={loading}>{loading?'جارٍ إنشاء الحساب...':'إنشاء الحساب والمتابعة'}</button>
      <p className="form-foot">لديك حساب؟ <a href="/customer-login" onClick={e=>{e.preventDefault();navigate('/customer-login')}}>تسجيل الدخول</a></p>
    </form>
  </div></section>
}
