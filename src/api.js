// Identical public contract; cookies are the sole authentication mechanism.
export const API_BASE='/api/customer';
const friendly={401:'انتهت جلسة الدخول. سجّل الدخول مجددًا.',403:'ليست لديك صلاحية لتنفيذ هذا الإجراء.',404:'الخدمة المطلوبة غير متاحة حاليًا.',429:'طلبات كثيرة خلال وقت قصير. أعد المحاولة لاحقًا.',502:'الخدمة السحابية لا تستجيب مؤقتًا.',503:'الخدمة قيد الصيانة أو غير متاحة مؤقتًا.',504:'انتهت مهلة اتصال الخدمة.'};
export async function api(path,{method='GET',body,signal,...rest}={}){
 const headers=new Headers(rest.headers||{});
 headers.set('Accept','application/json');
 if(body!==undefined && !(body instanceof FormData) && !headers.has('Content-Type'))headers.set('Content-Type','application/json');
 let response;try{response=await fetch(`${API_BASE}${path}`,{...rest,method,body:body instanceof FormData?body:body===undefined?undefined:JSON.stringify(body),credentials:'include',cache:'no-store',headers,signal,redirect:'follow'})}catch(err){throw new Error('تعذّر الاتصال بالخدمة. تحقق من الإنترنت وأعد المحاولة.')}
 const type=response.headers.get('content-type')||'';let result;
 try{result=type.includes('application/json')?await response.json():await response.text()}catch{result=null}
 if(!response.ok){const fromApi=typeof result==='object'&&result&&!Array.isArray(result)?(result.detail||result.message):'';const message=typeof fromApi==='string'&&fromApi.length<350?fromApi:friendly[response.status]||`تعذر تنفيذ الطلب (HTTP ${response.status}).`;const error=new Error(message);error.status=response.status;throw error}
 return result;
}
export const get=(path)=>api(path);
export const post=(path,body={})=>api(path,{method:'POST',body});
export const put=(path,body)=>api(path,{method:'PUT',body});
