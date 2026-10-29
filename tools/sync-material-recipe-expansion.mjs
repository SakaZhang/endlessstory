import fs from 'node:fs';
const path=new URL('../dist/potion-catalog.js',import.meta.url),source=JSON.parse(fs.readFileSync(new URL('../content/material-recipe-expansion.json',import.meta.url))),text=fs.readFileSync(path,'utf8');
const pattern=/export const POTION_RECIPE_CATALOG=freeze\(([^\n]+)\);/;
const match=text.match(pattern);if(!match)throw Error('recipe declaration not found');const recipes=JSON.parse(match[1]);
for(const row of source.mappings){const role=recipes[row.recipe]?.roles.find(r=>r.role==='aux');if(!role)throw Error('missing auxiliary role '+row.recipe);if(!role.materialIds.includes(row.material))role.materialIds.push(row.material);}
const next=text.replace(pattern,'export const POTION_RECIPE_CATALOG=freeze('+JSON.stringify(recipes)+');');
if(process.argv.includes('--check')){if(next!==text)throw Error('material recipe expansion drift');console.log('PASS material recipe expansion synchronized');}else{fs.writeFileSync(path,next);console.log('Updated auxiliary recipe material lists only');}
