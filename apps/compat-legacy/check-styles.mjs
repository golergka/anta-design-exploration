import {chromium} from 'playwright';
import {mkdtempSync,mkdirSync,writeFileSync,symlinkSync,rmSync,realpathSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {execFileSync,spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {createServer} from 'node:net';
const root=process.cwd(), baseline=realpathSync(mkdtempSync(join(tmpdir(),'compat-baseline-')));
mkdirSync(join(baseline,'src')); for(const name of ['index.html','src/main.jsx','src/style.css']) writeFileSync(join(baseline,name),execFileSync('git',['show',`compat-legacy-baseline:apps/compat-legacy/${name}`]));
symlinkSync(join(root,'node_modules'),join(baseline,'node_modules'));
const vite=join(root,'node_modules/.bin/vite');
execFileSync(vite,['build',baseline],{stdio:'ignore'});
execFileSync(vite,['build',root],{stdio:'ignore'});
async function freePort(){const socket=createServer();await new Promise((resolve,reject)=>socket.once('error',reject).listen(0,'127.0.0.1',resolve));const port=socket.address().port;await new Promise(resolve=>socket.close(resolve));return port}
const first=await freePort(), second=await freePort();
const servers=[spawn(vite,['preview','--host','127.0.0.1','--port',String(first),'--strictPort',baseline]),spawn(vite,['preview','--host','127.0.0.1','--port',String(second),'--strictPort',root])];
let browser;
try {
 for (const url of [`http://127.0.0.1:${first}`,`http://127.0.0.1:${second}`]) {let ready=false;for(let i=0;i<100;i++){try{await fetch(url);ready=true;break}catch{await new Promise(r=>setTimeout(r,100))}}if(!ready)throw Error(`Server unavailable: ${url}`)}
 browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH ? {executablePath:process.env.CHROME_PATH} : {})});
 const page=await browser.newPage({viewport:{width:1280,height:800}});
 async function read(url){await page.goto(url);await page.locator('.navbar').waitFor();return page.evaluate(()=>Object.fromEntries(['.navbar','.table','.form-control','.btn-outline-primary'].map(selector=>{const s=getComputedStyle(document.querySelector(selector));return [selector,{font:s.fontSize,color:s.color,background:s.backgroundColor,padding:s.padding,border:s.borderTopWidth}]})))}
 const before=await read(`http://127.0.0.1:${first}`);const after=await read(`http://127.0.0.1:${second}`);const granular=await read(`http://127.0.0.1:${second}/?no-reset`);const mitigation=await read(`http://127.0.0.1:${second}/?no-reset&root-size`);
 assert.equal(before['.navbar'].font,'16px');assert.equal(after['.navbar'].font,'15px');assert.equal(before['.form-control'].padding,'6px 12px');assert.equal(after['.form-control'].padding,'5.625px 11.25px');assert.equal(granular['.navbar'].font,'15px');assert.equal(granular['.form-control'].padding,'5.625px 11.25px');assert.deepEqual(mitigation,before);console.log(JSON.stringify({before,after,granular,mitigation},null,2));
} finally {await browser?.close();servers.forEach(p=>p.kill());rmSync(baseline,{recursive:true,force:true})}
