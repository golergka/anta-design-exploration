import {chromium} from 'playwright';
import {mkdtempSync,mkdirSync,writeFileSync,symlinkSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {execFileSync,spawn} from 'node:child_process';
import assert from 'node:assert/strict';
const root=process.cwd(), baseline=mkdtempSync(join(tmpdir(),'compat-baseline-'));
mkdirSync(join(baseline,'src')); for(const name of ['index.html','src/main.jsx','src/style.css']) writeFileSync(join(baseline,name),execFileSync('git',['show',`compat-legacy-baseline:apps/compat-legacy/${name}`]));
symlinkSync(join(root,'node_modules'),join(baseline,'node_modules'));
const vite=join(root,'node_modules/.bin/vite');
const servers=[spawn(vite,['--host','127.0.0.1','--port','4381','--strictPort',baseline]),spawn(vite,['--host','127.0.0.1','--port','4382','--strictPort',root])];
let browser;
try {
 for (const url of ['http://127.0.0.1:4381','http://127.0.0.1:4382']) {let ready=false;for(let i=0;i<100;i++){try{await fetch(url);ready=true;break}catch{await new Promise(r=>setTimeout(r,100))}}if(!ready)throw Error(`Server unavailable: ${url}`)}
 browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const page=await browser.newPage({viewport:{width:1280,height:800}});
 async function read(url){await page.goto(url);await page.locator('.navbar').waitFor();return page.evaluate(()=>Object.fromEntries(['.navbar','.table','.form-control','.btn-outline-primary'].map(selector=>{const s=getComputedStyle(document.querySelector(selector));return [selector,{font:s.fontSize,color:s.color,background:s.backgroundColor,padding:s.padding,border:s.borderTopWidth}]})))}
 const before=await read('http://127.0.0.1:4381');const after=await read('http://127.0.0.1:4382');const granular=await read('http://127.0.0.1:4382/?no-reset');const mitigation=await read('http://127.0.0.1:4382/?no-reset&root-size');
 assert.equal(before['.navbar'].font,'16px');assert.equal(after['.navbar'].font,'15px');assert.equal(before['.form-control'].padding,'6px 12px');assert.equal(after['.form-control'].padding,'5.625px 11.25px');assert.equal(granular['.navbar'].font,'15px');assert.equal(granular['.form-control'].padding,'5.625px 11.25px');assert.deepEqual(mitigation,before);console.log(JSON.stringify({before,after,granular,mitigation},null,2));
} finally {await browser?.close();servers.forEach(p=>p.kill());rmSync(baseline,{recursive:true,force:true})}
