import React from 'react'
export default function SectionTitle({ eyebrow, title, text, center=false }) {
  return <div className={center ? 'section-title center' : 'section-title'}>
    {eyebrow && <span className="eyebrow">{eyebrow}</span>}
    <h2>{title}</h2>
    {text && <p>{text}</p>}
  </div>
}
