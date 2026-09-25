import React from 'react'
export default function TutorialCard({ item, category }) {
  const url = `https://www.youtube.com/watch?v=${item.videoId}`
  const thumb = item.image || `https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`
  return <article className="tutorial-card">
    <a className="tutorial-thumb" href={url} target="_blank" rel="noreferrer">
      <img loading="lazy" src={thumb} alt={item.title} />
      <span className="play">▶</span>
    </a>
    <div className="tutorial-body"><small>{category?.icon} {category?.title}</small><h3>{item.title}</h3>{item.description&&<p>{item.description}</p>}<a href={url} target="_blank" rel="noreferrer">مشاهدة الشرح <span>↗</span></a></div>
  </article>
}
