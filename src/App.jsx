import React, { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Features from './pages/Features.jsx'
import Tutorials from './pages/Tutorials.jsx'
import Network from './pages/Network.jsx'
import Mikrotik from './pages/Mikrotik.jsx'
import Updates from './pages/Updates.jsx'
import Faq from './pages/Faq.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'
import Guide from './pages/Guide.jsx'

const routes = {'/':Home,'/features':Features,'/tutorials':Tutorials,'/network':Network,'/mikrotik':Mikrotik,'/updates':Updates,'/faq':Faq,'/contact':Contact,'/guide':Guide}

export default function App(){
  const [path,setPath]=useState(window.location.pathname)
  const navigate=(to)=>{const [pathname,search='']=to.split('?');history.pushState({},'',to);setPath(pathname);window.scrollTo({top:0,behavior:'smooth'});if(search) setTimeout(()=>window.dispatchEvent(new PopStateEvent('popstate')),0)}
  useEffect(()=>{const handler=()=>setPath(window.location.pathname);window.addEventListener('popstate',handler);return()=>window.removeEventListener('popstate',handler)},[])
  useEffect(()=>{document.documentElement.dir='rtl';document.documentElement.lang='ar'},[])
  const Page=routes[path]||NotFound
  return <div className="app"><Header path={path} navigate={navigate}/><main><Page navigate={navigate}/></main><Footer navigate={navigate}/></div>
}
