import {openAccount,accountEvents} from '../src/pages/account.js';
const fake={innerHTML:'',listeners:{},addEventListener(k,cb){this.listeners[k]=cb},scrollIntoView(){}};
globalThis.document={title:'',getElementById(id){return id==='account-root'?fake:null},querySelector(){return {setAttribute(){}}}};
globalThis.fetch=async(url,opts)=>{const p=url.replace('/api/customer','');const val=p==='/me'?{customer:{id:1,full_name:'Test customer',email:'test@example.invalid',network_name:'Lab Network',email_verified:true},service:{status:'active'},financial:{status:'credit',credit_balance:'12.50',currency:'SAR'},subscription:{plan_name:'Demo'},router:{provisioned:true,serial_verified:true,model:'Demo Router',remote_access_enabled:true,remote_access_host:'test.example.invalid',remote_alias:'Demo Lab',access_endpoints:[{service:'ssh',label:'SSH',address:'demo.example.invalid:2222'}],device_portal:{username:'demo-user',max_devices:10,url:'https://example.invalid/devices'}},trial:{status:'not_requested',default_days:5,can_request:false},invoices:[{id:1,invoice_no:'TEST-1',balance_due:0,currency:'SAR'}],orders:[],payment_confirmations:[]}:p==='/plans'?[{id:1,name:'Test',price:12,currency:'SAR',billing_months:1}]:p==='/config'?{payment:{method:'Example',account_number:'TEST-DO-NOT-PAY',account_label:'Demo'}}:p==='/router/connection-ports'?{services:{api:{internal_port:8728,enabled:true},ssh:{internal_port:22,enabled:true},ftp:{internal_port:21,enabled:true}}}:null;return new Response(JSON.stringify(val),{status:200,headers:{'content-type':'application/json'}})};
await openAccount();accountEvents();
if(!fake.innerHTML.includes('Lab Network')||!fake.innerHTML.includes('12.50'))throw Error('Overview missing real API data');
console.log('PASS: account overview renders actual mock API response; no static production data');
for(const t of ['plans','billing','trial','router','access','devices','settings']){
 const item={dataset:{tab:t}};
 await fake.listeners.click({target:{closest(s){return s==='[data-tab]'?item:null}}});
 if(!fake.innerHTML.includes('dash-content')||fake.innerHTML.includes('undefined'))throw Error(`Account tab ${t} not rendered correctly`);
 console.log(`PASS: account section ${t}`)
}
console.log('ACCOUNT SMOKE PASS — mock-only. Server session and real mutating operations not tested.');
