import React from 'react'
import Disclosure from './Disclosure.jsx'

export default function StepGuide({ title = 'شرح تنفيذ الخطوة', items = [], note, defaultOpen = false }) {
  return <Disclosure title={title} subtitle="اضغط لعرض الخطوات بالتفصيل" badge="دليل تنفيذي" defaultOpen={defaultOpen} className="step-guide">
    <ol className="step-guide-list">
      {items.map((item, index) => <li key={index}>
        <span>{String(index + 1).padStart(2, '0')}</span>
        <div>{typeof item === 'string' ? <p>{item}</p> : item}</div>
      </li>)}
    </ol>
    {note && <div className="step-guide-note">{note}</div>}
  </Disclosure>
}
