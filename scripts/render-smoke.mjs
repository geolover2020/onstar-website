import content from '../public/content/site_content.json' with {type:'json'};
import guides from '../public/content/platform_guides.json' with {type:'json'};
import {state} from '../src/lib.js';
import * as m from '../src/pages/marketing.js';
import * as k from '../src/pages/knowledge.js';
import {accountShell} from '../src/pages/account.js';
import {authView} from '../src/pages/auth.js';
state.content=content;state.guides=guides;
globalThis.location={search:'',origin:'https://webs.onstareh.com'};
globalThis.document={title:'',querySelector:()=>({setAttribute(){}}),getElementById:()=>null};
const renderers={home:m.home,app:m.appProduct,cloud:m.cloudProduct,services:m.services,contact:m.contact,faq:m.faq,guides:()=>k.knowledge('guides'),tools:()=>k.knowledge('tools'),videos:()=>k.knowledge('videos'),toolDetail:()=>k.toolDetail(content.tools[0].slug),guideDetail:()=>k.guideDetail(guides.platformGuides[0].id),account:accountShell,register:()=>authView('/register'),login:()=>authView('/customer-login'),verify:()=>authView('/verify-email'),forgot:()=>authView('/forgot-password')};
for(const [name,fn] of Object.entries(renderers)){const html=fn();if(html.length<100||html.includes('${'))throw new Error(`Page template invalid: ${name}`);console.log(`PASS ${name} (${html.length} HTML chars)`) }
console.log('RENDER SMOKE PASS: 16 route templates. Browser layout NOT validated.')
