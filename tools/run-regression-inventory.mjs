// Run every root regression in a fresh process, without fail-fast or shared globals.
// npm test remains the release aggregate; this inventory also finds orphaned suites.
import {readdirSync,mkdtempSync,createWriteStream,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
const root=fileURLToPath(new URL('../',import.meta.url));
const discovered=readdirSync(root).filter(f=>/(?:-tests\.(?:mjs|cjs)$|^test-.*\.mjs$)/.test(f)).sort();
const requested=process.argv.slice(2);
for(const file of requested)if(!discovered.includes(file))throw Error('Unknown root regression: '+file);
const files=requested.length?[...new Set(requested)]:discovered;
const concurrency=Number(process.env.TEST_CONCURRENCY??2);
if(!Number.isInteger(concurrency)||concurrency<1||concurrency>8)throw Error('TEST_CONCURRENCY must be an integer from 1 to 8');
const output=mkdtempSync(join(tmpdir(),'rpg-regressions-')),results=[];
console.log(`Running ${files.length}/${discovered.length} discovered regressions; logs: ${output}`);
let next=0;
async function worker(){
 while(next<files.length){
  const file=files[next++],started=Date.now(),log=join(output,file+'.log'),stream=createWriteStream(log);
  const result=await new Promise(resolve=>{
   const child=spawn(process.execPath,[file],{cwd:root,env:process.env,stdio:['ignore','pipe','pipe']});
   child.stdout.pipe(stream,{end:false});child.stderr.pipe(stream,{end:false});
   let error=null;child.on('error',e=>{error=String(e);});
   child.on('close',(code,signal)=>stream.end(()=>resolve({file,code,signal,error,seconds:Math.round((Date.now()-started)/100)/10,log})));
  });
  results.push(result);console.log(`${result.code===0?'PASS':'FAIL'} ${file} (${result.seconds}s)`);
 }
}
await Promise.all(Array.from({length:Math.min(concurrency,files.length)},worker));
results.sort((a,b)=>a.file.localeCompare(b.file));
const failed=results.filter(r=>r.code!==0),report={discovered:discovered.length,selected:files.length,passed:results.length-failed.length,failed:failed.length,results};
writeFileSync(join(output,'results.json'),JSON.stringify(report,null,2)+'\n');
console.log(`${report.passed}/${files.length} passed; ${failed.length} failed. Full report: ${join(output,'results.json')}`);
process.exitCode=failed.length?1:0;
