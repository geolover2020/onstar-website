import React from 'react'
import Logo from './Logo.jsx'
import { whatsapp } from '../data/content.js'

export default function Footer({ navigate }) {
  return <footer className="footer">
    <div className="container footer-grid">
      <div><Logo/><p>أدوات متقدمة لإدارة وتطوير صفحات تسجيل الدخول وشبكات MikroTik.</p></div>
      <div><h4>روابط سريعة</h4><a href="/features" onClick={e=>{e.preventDefault();navigate('/features')}}>المميزات</a><a href="/tutorials" onClick={e=>{e.preventDefault();navigate('/tutorials')}}>الشروحات</a><a href="/faq" onClick={e=>{e.preventDefault();navigate('/faq')}}>الأسئلة الشائعة</a></div>
      <div><h4>المجتمع</h4><a href={whatsapp.group} target="_blank" rel="noreferrer">جروب OnStar</a><a href={whatsapp.developer} target="_blank" rel="noreferrer">التواصل مع المطور</a></div>
    </div>
    <div className="container footer-bottom"><span>© {new Date().getFullYear()} OnStar — جميع الحقوق محفوظة</span><span>Made for MikroTik network operators</span></div>
  </footer>
}
