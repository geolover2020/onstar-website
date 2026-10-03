import React, { useState } from 'react'
import { postJson } from '../lib/customerApi.js'

export default function CustomerLogin({ navigate }) {
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [loading,setLoading]=useState(false); const [error,setError]=useState('')
  async function submit(e){e.preventDefault();setError('');setLoading(true);try{await postJson('/login',{email:email.trim(),password});navigate('/account')}catch(err){setError(err.message)}finally{setLoading(false)}}
  return <section className="auth-page"><div className="container auth-layout compact"><div className="auth-copy"><span className="eyebrow">بوابة المشترك</span><h1>تابع طلبك وخدمتك من مكان واحد</h1><p>من لوحة المشترك يمكنك متابعة حالة الطلب، التجربة المجانية، الفواتير، إرسال تأكيد الدفع وحالة MikroTik المرتبط.</p></div><form className="auth-card" onSubmit={submit}><h2>تسجيل الدخول</h2><label>البريد الإلكتروني<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email"/></label><label>كلمة المرور<input required type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password"/></label>{error&&<div className="form-error">{error}</div>}<button className="btn btn-primary full-btn" disabled={loading}>{loading?'جارٍ الدخول...':'دخول المشترك'}</button><p className="form-foot">ليس لديك حساب؟ <a href="/register" onClick={e=>{e.preventDefault();navigate('/register')}}>إنشاء حساب</a></p></form></div></section>
}
