import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {uiPixelIcon,UI_PIXEL_ICON_KEYS} from './dist/ui-pixel-icons.js';
assert.equal(UI_PIXEL_ICON_KEYS.length,7);
for(const key of UI_PIXEL_ICON_KEYS){const svg=uiPixelIcon(key);assert.match(svg,/viewBox="0 0 24 24"/);assert.match(svg,/shape-rendering="crispEdges"/);assert(!/<text|<image|href=|script|onload/.test(svg));assert.match(svg,/aria-label=/);assert(svg.includes('<rect'));}
assert.equal(uiPixelIcon('missing'),'');
const app=readFileSync('dist/app.js','utf8');assert(app.includes("uiPixelIcon('nav-skills')"));assert(app.includes("renderPixelInventory as renderInventory"));
assert(!app.includes("$('viewEyebrow').textContent=en"));
console.log('PASS7 original pixel SVG resources, no emoji/text/image dependencies, accessible semantic labels and live navigation/inventory wiring');
