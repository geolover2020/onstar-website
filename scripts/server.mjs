import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {join,extname,normalize} from 'node:path';
const dir=process.env.SERVE_DIST==='1'?'dist':'.';const port=Number(process.env.PORT||4173);
const types={'.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.html':'text/html; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.xml':'application/xml'};
createServer(async(req,res)=>{const url=new URL(req.url||'/',`http://${req.headers.host}`);const pathname=decodeURIComponent(url.pathname);if(pathname.startsWith('/api/')){res.writeHead(503,{'Content-Type':'application/json'});res.end(JSON.stringify({detail:'في وضع التطوير المحلي يحتاج Customer API إلى Netlify proxy أو بيئة اختبار خلفية مستقلة.'}));return;}
let p=pathname; if(p.startsWith('/content/')||p.startsWith('/media/')||p.startsWith('/app-assets/')||['/media-app-settings.png','/site.webmanifest','/onstar-mark.svg','/robots.txt'].includes(p)){if(dir==='.')p='/public'+p;}
let f=join(dir,normalize(p).replace(/^\/+/,''));try{if((await stat(f)).isDirectory())f=join(f,'index.html')}catch{};
try{const b=await readFile(f);res.writeHead(200,{'Content-Type':types[extname(f)]||'application/octet-stream'});res.end(b)}catch{const h=await readFile(join(dir,'index.html'));res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end(h)}}).listen(port,()=>console.log(`Preview at http://127.0.0.1:${port}`));
