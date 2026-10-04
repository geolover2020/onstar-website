import React, { useCallback, useEffect, useState } from 'react'
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
import Services from './pages/Services.jsx'
import RemoteAccess from './pages/RemoteAccess.jsx'
import CustomerRegister from './pages/CustomerRegister.jsx'
import CustomerLogin from './pages/CustomerLogin.jsx'
import CustomerAccount from './pages/CustomerAccount.jsx'
import CustomerVerifyEmail from './pages/CustomerVerifyEmail.jsx'
import CustomerPasswordReset from './pages/CustomerPasswordReset.jsx'
import { customerApi } from './lib/customerApi.js'

const routes = {
  '/':Home,
  '/features':Features,
  '/tutorials':Tutorials,
  '/network':Network,
  '/mikrotik':Mikrotik,
  '/updates':Updates,
  '/faq':Faq,
  '/contact':Contact,
  '/guide':Guide,
  '/services':Services,
  '/remote-access':RemoteAccess,
  '/register':CustomerRegister,
  '/customer-login':CustomerLogin,
  '/account':CustomerAccount,
  '/verify-email':CustomerVerifyEmail,
  '/forgot-password':CustomerPasswordReset,
}

const SESSION_HINT='onstar_customer_session_hint'

export default function App(){
  const [path,setPath]=useState(window.location.pathname)
  const [auth,setAuth]=useState(()=>({checking:true,authenticated:localStorage.getItem(SESSION_HINT)==='1',customer:null}))
  const navigate=(to)=>{const [pathname,search='']=to.split('?');history.pushState({},'',to);setPath(pathname);window.scrollTo({top:0,behavior:'smooth'});if(search) setTimeout(()=>window.dispatchEvent(new PopStateEvent('popstate')),0)}

  const refreshAuth=useCallback(async()=>{
    try{
      const me=await customerApi('/me')
      localStorage.setItem(SESSION_HINT,'1')
      setAuth({checking:false,authenticated:true,customer:me.customer||null})
      return me
    }catch(e){
      if(e.status===401){
        localStorage.removeItem(SESSION_HINT)
        setAuth({checking:false,authenticated:false,customer:null})
        return null
      }
      setAuth(x=>({...x,checking:false}))
      return null
    }
  },[])

  useEffect(()=>{const handler=()=>setPath(window.location.pathname);window.addEventListener('popstate',handler);return()=>window.removeEventListener('popstate',handler)},[])
  useEffect(()=>{document.documentElement.dir='rtl';document.documentElement.lang='ar'},[])
  useEffect(()=>{refreshAuth()},[refreshAuth])

  const Page=routes[path]||NotFound
  return <div className="app">
    <Header path={path} navigate={navigate} auth={auth}/>
    <main><Page navigate={navigate} auth={auth} refreshAuth={refreshAuth}/></main>
    <Footer navigate={navigate}/>
  </div>
}
