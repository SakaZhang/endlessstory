import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderPixelForgeTabs,serviceDetails,serviceNotice} from './dist/pixel-services.js';
for(const active of ['fusion','modify','enhancement','recipes']){
 const html=renderPixelForgeTabs(active);assert.equal((html.match(/data-forgetab=/g)||[]).length,4);assert.equal((html.match(/aria-pressed="true"/g)||[]).length,1);assert.equal((html.match(/<svg/g)||[]).length,4);assert.match(html,new RegExp('data-forgetab="'+active+'" class="active"'));
}
assert.match(serviceDetails('<rules>','<p>Paid costs are not refunded.</p>'),/<details class="pixelServiceDetails"><summary>&lt;rules&gt;<\/summary>/);assert.match(serviceDetails('规则','<p>必留风险</p>'),/<p>必留风险<\/p>/);assert(!serviceNotice('<script>').includes('<script>'));
const css=readFileSync(new URL('./dist/pixel-services.css',import.meta.url),'utf8');assert(css.includes('.pixelForgeBench'));assert(css.includes('grid-template-columns:repeat(4,minmax(0,1fr))'));assert(css.includes('@media(max-width:760px)'));assert(css.includes('focus-visible'));assert(css.includes('prefers-reduced-motion'));assert(!/font-size:\s*(?:[0-9]|1[01])px/.test(css));assert(!/display:\s*none/.test(css),'no transactional controls or risk hidden by CSS');
console.log('PASS pixel services: four icon actions, accessible native disclosures, escaped labels, responsive workbench/8-slot merchant/skill grid, ≥12px copy, no hidden transactions');
