import React from 'react'

export default function Disclosure({ title, subtitle, badge, children, defaultOpen = false, className = '' }) {
  return <details className={`premium-disclosure ${className}`.trim()} open={defaultOpen}>
    <summary>
      <span className="disclosure-copy">
        {badge && <small>{badge}</small>}
        <strong>{title}</strong>
        {subtitle && <em>{subtitle}</em>}
      </span>
      <span className="disclosure-chevron" aria-hidden="true">⌄</span>
    </summary>
    <div className="disclosure-body">{children}</div>
  </details>
}
