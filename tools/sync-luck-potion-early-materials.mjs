import fs from 'node:fs';
const source=JSON.parse(fs.readFileSync(new URL('../content/luck-potion-early-materials.json',import.meta.url)));
const check=process.argv.includes('--check'),root=new URL('../',import.meta.url);
function update(path,transform){const url=new URL(path,root),before=fs.readFileSync(url,'utf8'),after=transform(before);if(before!==after){if(check)throw Error('Luck material source is out of sync: '+path);fs.writeFileSync(url,after);}}
const escaped=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
for(const material of source.materials)for(const path of material.files)update(path,text=>{
 const pattern=new RegExp('("id"\\s*:\\s*"'+escaped(material.id)+'"[\\s\\S]*?"functionalTags"\\s*:\\s*)(\\[[^\\]]*\\])','g');let count=0;
 const out=text.replace(pattern,(_,prefix,raw)=>{count++;const tags=JSON.parse(raw),next=[...new Set([...tags,'luckBase','luckAux'])];return prefix+(JSON.stringify(tags)===JSON.stringify(next)?raw:JSON.stringify(next));});
 if(count!==1)throw Error('Expected exactly one material definition: '+path+' '+material.id+' got '+count);return out;
});
update('dist/potion-catalog.js',text=>{let count=0;const out=text.replace(/(export const POTION_RECIPE_CATALOG=freeze\()(.+)(\);)/,(_,prefix,raw,suffix)=>{
 count++;const catalog=JSON.parse(raw),recipe=catalog[source.recipeId];if(!recipe||recipe.roles.length!==2)throw Error('Missing luck recipe roles');for(const role of recipe.roles){if(!['luckBase','luckAux'].includes(role.functionalTag))throw Error('Unexpected luck role');role.materialIds=[...new Set([...role.materialIds,...source.materials.map(m=>m.id)])];}return prefix+JSON.stringify(catalog)+suffix;
});if(count!==1)throw Error('Expected one recipe catalog declaration');return out;});
console.log(check?'PASS lucky early-material author source and runtime catalog/tags synchronized.':'Synchronized lucky early-material author source and runtime catalog/tags.');
