import React from 'react'
export default function Logo({ compact = false }) {
  return <a className="brand" href="/" data-link>
    <span className="brand-mark"><span /></span>
    {!compact && <span className="brand-text"><b>OnStar</b><small>الإصدار الثالث</small></span>}
  </a>
}
