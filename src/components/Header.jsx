import React, { useEffect, useState } from 'react'
import Logo from './Logo.jsx'

const links = [
  ['/', 'الرئيسية'], ['/features','المميزات'], ['/guide','دليل الأدوات'], ['/tutorials','الشروحات'], ['/network','إدارة الشبكة'], ['/mikrotik','MikroTik'], ['/updates','التحديثات'], ['/faq','الأسئلة الشائعة'], ['/contact','تواصل معنا']
]

export default function Header({ path, navigate }) {
  const [open, setOpen] = useState(false)
  useEffect(() => setOpen(false), [path])
  return <header className="site-header">
    <div className="container nav-wrap">
      <Logo />
      <nav className={open ? 'nav-links open' : 'nav-links'}>
        {links.map(([href,label]) => <a key={href} href={href} className={path === href ? 'active' : ''} onClick={(e)=>{e.preventDefault();navigate(href)}}>{label}</a>)}
      </nav>
      <div className="nav-actions">
        <a className="btn btn-small btn-primary desktop-only" href="/guide" onClick={(e)=>{e.preventDefault();navigate('/guide')}}>دليل الأدوات</a>
        <button className="menu-btn" aria-label="القائمة" onClick={()=>setOpen(v=>!v)}><span/><span/><span/></button>
      </div>
    </div>
  </header>
}
