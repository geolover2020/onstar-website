import React from 'react'
export default function AppMockup() {
  return <div className="mockup-shell">
    <div className="phone-glow" />
    <div className="phone">
      <div className="phone-top"><span/><b>OnStar</b><i/></div>
      <div className="phone-screen">
        <div className="mini-hero"><small>لوحة التحكم</small><strong>مرحبًا بك في OnStar</strong><span>إدارة شبكتك من مكان واحد</span></div>
        <div className="mini-stats"><span><b>142</b><small>جهاز</small></span><span><b>131</b><small>متصل</small></span><span><b>11</b><small>غير متصل</small></span></div>
        <div className="mini-grid">
          {['HotSpot','Ping','VLAN','Backup','Speed','Tools'].map((x,i)=><div key={x}><em>{['◎','⌁','◇','⇩','⚡','⚙'][i]}</em><b>{x}</b></div>)}
        </div>
      </div>
    </div>
    <div className="floating-card card-a"><span>●</span><b>Ping Online</b><small>12 ms</small></div>
    <div className="floating-card card-b"><span>⚡</span><b>Queue Tree</b><small>Active</small></div>
  </div>
}
