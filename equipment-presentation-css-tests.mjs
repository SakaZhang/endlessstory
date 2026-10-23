import assert from 'node:assert/strict';
import fs from 'node:fs';
const css=fs.readFileSync('dist/equipment-presentation.css','utf8'),html=fs.readFileSync('dist/index.html','utf8');
assert.equal((html.match(/href="equipment-presentation.css"/g)||[]).length,1);
assert(html.indexOf('equipment-presentation.css')>html.indexOf('equipment-workshop-ui.css'));
assert(/黑炉余烬 · v\d+\.\d+/.test(html),'current release label remains visible without prototype copy');
for(const c of ['itemCell','equipSlot','detailIcon','forgeResult','orbitSlot','fusionGearCard','commodityCard','donorCard','collectionTile','collectionDetail','collectedPart','loadoutGearSlot','batchSaleItem','workshopItem','shopGearIcon','workshopBigIcon','workshopTemplate'])assert(css.includes('.'+c),c);
for(const [q,color]of [[0,'#555b61'],[1,'#21476a'],[2,'#49305e'],[3,'#682d36']])assert(new RegExp(`data-equipment-quality="${q}"[\\s\\S]*?background:${color}!important`).test(css));
assert(css.includes('border-color:#48515a!important'));
assert(css.includes('border-color:#6aaf70!important'));
assert(css.includes('svg[data-equipment-set="true"]'));
assert(css.includes('outline:2px solid #e6d8a0'));
assert(css.includes('.fusionGearCard.fusionSelected:has(svg[data-equipment-quality])'));
assert(css.includes('.itemCell.setFrame.selected:has(svg[data-equipment-set="true"])'));
assert(css.includes('svg[data-equipment-quality] { filter:none!important; }'));
assert(!/\.r[0-9]\b|\.materialStack|\.materialCommodity|\.potion|\.affix/.test(css));
const blocks=css.replace(/\/\*[\s\S]*?\*\//g,'').match(/[^{}]+\{[^{}]+\}/g);
for(const block of blocks){const selector=block.split('{')[0].trim();assert(selector.includes(':has(svg[data-equipment-')||selector==='svg[data-equipment-quality]',selector);assert(!/width:|height:|padding:|display:|position:/.test(block));}
console.log('PASS equipment CSS: 17 contexts including merchant icon, four quality fills, neutral/set frames, selected/fusionSelected outlines, equipment-only legacy glow removal, no geometry/material/potion/affix changes; override loaded last. Static coverage.');
