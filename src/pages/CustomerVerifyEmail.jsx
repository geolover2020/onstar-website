import React,{useState} from 'react'
import {postJson} from '../lib/customerApi.js'
export default function CustomerVerifyEmail({navigate}){
  const params=new URLSearchParams(window.location.search)
  const [email,setEmail]=useState(params.get('email')||localStorage.getItem('onstar_pending_email')||'')
  const [code,setCode]=useState(''),[loading,setLoading]=useState(false),[error,setError]=useState(''),[msg,setMsg]=useState(params.get('sent')==='1'?'تم إرسال رمز التحقق إلى بريدك.':'')
  async function verify(e){e.preventDefault();setLoading(true);setError('');setMsg('');try{await postJson('/email/verify',{email:email.trim(),code:code.trim()});localStorage.removeItem('onstar_pending_email');setMsg('تم تأكيد البريد بنجاح. يمكنك تسجيل الدخول الآن.');setTimeout(()=>navigate('/customer-login'),900)}catch(e){setError(e.message)}finally{setLoading(false)}}
  async function resend(){setLoading(true);setError('');try{const r=await postJson('/email/resend',{email:email.trim()});setMsg(r.email_sent?'تم إرسال رمز جديد.':'تعذر إرسال البريد حاليًا. تواصل مع الإدارة.') }catch(e){setError(e.message)}finally{setLoading(false)}}
  return <section className="auth-page"><div className="container"><form className="auth-card narrow-card" onSubmit={verify}><span className="eyebrow">تأكيد البريد</span><h1>أدخل رمز التحقق</h1><p>رمز مكون من 6 أرقام وصلاحيته 15 دقيقة.</p><label>البريد الإلكتروني<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} dir="ltr"/></label><label>رمز التحقق<input required value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,'').slice(0,6))} inputMode="numeric" className="verify-code-input"/></label>{msg&&<div className="notice-box good">{msg}</div>}{error&&<div className="form-error">{error}</div>}<button className="btn btn-primary full-btn" disabled={loading}>تأكيد البريد</button><button type="button" className="btn btn-ghost full-btn" disabled={loading} onClick={resend}>إرسال رمز جديد</button></form></div></section>
}
