import React, { useEffect, useState } from 'react'
import Logo from './Logo.jsx'

const groups = [
  {
    label: 'المنتج',
    items: [
      ['/features','المميزات','نظرة كاملة على قدرات OnStar'],
      ['/guide','دليل الأدوات','شرح كل أداة وخطوات استخدامها'],
      ['/tutorials','الشروحات','مكتبة الفيديوهات العملية'],
      ['/updates','التحديثات','الجديد في الإصدارات'],
    ],
  },
  {
    label: 'الخدمات',
    items: [
      ['/remote-access','الدخول عن بُعد','Remote Access وإدارة الاشتراك'],
      ['/services','خدمات الفريق','تنفيذ وتهيئة الشبكات'],
      ['/network','إدارة الشبكة','الأجهزة والفحص والمتابعة'],
      ['/mikrotik','MikroTik','أدوات RouterOS والإدارة'],
    ],
  },
  {
    label: 'المساعدة',
    items: [
      ['/faq','الأسئلة الشائعة','إجابات سريعة على أكثر الأسئلة'],
      ['/contact','تواصل معنا','قنوات التواصل والدعم'],
    ],
  },
]

function NavLink({ href, label, description, path, navigate }) {
  return <a href={href} className={path===href?'active':''} onClick={e=>{e.preventDefault();navigate(href)}}>
    <span>{label}</span>{description&&<small>{description}</small>}
  </a>
}

export default function Header({ path, navigate, auth }) {
  const [open, setOpen] = useState(false)
  useEffect(() => setOpen(false), [path])
  const logged=!!auth?.authenticated
  const groupActive=(g)=>g.items.some(([href])=>href===path)
  return <header className="site-header premium-header">
    <div className="container nav-wrap">
      <Logo />
      <nav className="desktop-mega-nav" aria-label="القائمة الرئيسية">
        <NavLink href="/" label="الرئيسية" path={path} navigate={navigate}/>
        {groups.map(group=><div className={`mega-nav-item ${groupActive(group)?'active':''}`} key={group.label}>
          <button type="button" className="mega-nav-trigger">{group.label}<span>⌄</span></button>
          <div className="mega-menu">
            <div className="mega-menu-title"><b>{group.label}</b><small>اختر القسم الذي تريد الوصول إليه</small></div>
            <div className="mega-menu-links">{group.items.map(([href,label,description])=><NavLink key={href} href={href} label={label} description={description} path={path} navigate={navigate}/>)}</div>
          </div>
        </div>)}
      </nav>
      <div className="nav-actions">
        <a className={`account-nav-link ${logged?'logged':''}`} href={logged?'/account':'/customer-login'} onClick={(e)=>{e.preventDefault();navigate(logged?'/account':'/customer-login')}}>
          <span className="account-nav-dot"/>{logged?'لوحة حسابي':'دخول العملاء'}
        </a>
        {!logged&&<button className="btn btn-primary btn-small header-register" onClick={()=>navigate('/register')}>إنشاء حساب</button>}
        <button className={`menu-btn ${open?'open':''}`} aria-label="القائمة" aria-expanded={open} onClick={()=>setOpen(v=>!v)}><span/><span/><span/></button>
      </div>
    </div>
    <div className={`mobile-nav-sheet ${open?'open':''}`}>
      <div className="container mobile-nav-inner">
        <NavLink href="/" label="الرئيسية" path={path} navigate={navigate}/>
        {groups.map(group=><details className="mobile-nav-group" key={group.label} open={groupActive(group)}>
          <summary>{group.label}<span>⌄</span></summary>
          <div>{group.items.map(([href,label,description])=><NavLink key={href} href={href} label={label} description={description} path={path} navigate={navigate}/>)}</div>
        </details>)}
        <div className="mobile-nav-actions">
          <button className="btn btn-primary" onClick={()=>navigate(logged?'/account':'/register')}>{logged?'فتح حسابي':'إنشاء حساب عميل'}</button>
          {!logged&&<button className="btn btn-ghost" onClick={()=>navigate('/customer-login')}>تسجيل الدخول</button>}
        </div>
      </div>
    </div>
  </header>
}
