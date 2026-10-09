import {cpSync,rmSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('..',import.meta.url));
const dst=join(root,'dist'); rmSync(dst,{recursive:true,force:true});mkdirSync(dst,{recursive:true});
for(const item of ['index.html','public','src']){cpSync(join(root,item),item==='public'?dst:join(dst,item),{recursive:true,force:true});}
const base='https://webs.onstareh.com';
const paths=['/','/app','/cloud','/account','/register','/customer-login','/verify-email','/forgot-password','/knowledge','/tools','/videos','/services','/contact','/faq','/guide','/tutorials','/remote-access'];
const xml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+paths.filter(p=>!['/account','/verify-email','/forgot-password','/customer-login','/register'].includes(p)).map(p=>`<url><loc>${base}${p}</loc></url>`).join('')+'</urlset>';
writeFileSync(join(dst,'sitemap.xml'),xml);
console.log('BUILD PASS: dist/ generated. API proxy stays in netlify.toml; no backend or credentials packaged.');
