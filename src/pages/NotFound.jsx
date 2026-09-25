import React from 'react'
export default function NotFound({navigate}){return <section className="not-found"><div><span>404</span><h1>الصفحة غير موجودة</h1><p>الرابط الذي فتحته غير متاح.</p><button className="btn btn-primary" onClick={()=>navigate('/')}>العودة للرئيسية</button></div></section>}
