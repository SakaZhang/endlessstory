import {EXPANSION_PACKS} from './dist/race-packs.js';
// Explicit reviewed nonruntime QA/authoring files. Sources remain versioned; never use a filename wildcard.
// Adding an exclusion requires confirming no live consumer and updating packaging tests.
export const RELEASE_QA_EXCLUSIONS = Object.freeze([
  "races/goblin/equipment-native-proof.png",
  "races/goblin/hero-weapons-native-proof.png",
  "races/goblin/monsters-native-proof.png",
  "races/goblin/skills-native-proof.png",
  "races/ashen/art/hero-weapon-states-proof.png",
  "races/ashen/art/icons-proof.png",
  "races/ashen/art/monster-clean-death-proof.png",
  "races/ashen/art/monster-clean-hurt-proof.png",
  "races/ashen/art/monster-clean-idle-0-proof.png",
  "races/ashen/art/monster-clean-strike-proof.png",
  "races/ashen/art/native-a01-proof.png",
  "races/human/assets/all-monster-lifecycle-proof.png",
  "races/human/assets/lifecycle-native-proof.png",
  "races/human/assets/native-scene-proof.png",
  // No runtime references: internal integration/canon notes and art QA metadata.
  "races/goblin/INTEGRATION.md",
  "races/goblin/canon.md",
  "races/goblin/art-qa.json",
  "races/elf/canonical-source.md",
  // Unreferenced generation provenance contains prompts and local workspace paths.
  "story-assets/high-priest.json",
  "story-assets/seal-core.json",
  "story-assets/generation-log.json",
  // Final audited extraction/provenance records, never fetched by the runtime.
  "races/ashen/art-extraction-audit.json",
  "story-assets/alpha-verification.json",
  "races/elf/art-provenance.json",
  "races/elf/clean-extraction.json",
  "races/human/assets/lifecycle-source-crops.json",
  "story-assets/outsider-vanguard.json"
]);
export function releaseAssetRows(sourceRows){
 const exclusions=new Set(RELEASE_QA_EXCLUSIONS);
 const omitted=sourceRows.filter(row=>exclusions.has(row.path));
 function checkRegistered(value){
  if(typeof value==='string'&&exclusions.has(value.replace(/^\.\.\//,'')))throw Error('Release QA exclusion is referenced by registered art: '+value);
  if(value&&typeof value==='object')Object.values(value).forEach(checkRegistered);
 }
 EXPANSION_PACKS.forEach(pack=>checkRegistered(pack.art));
 const runtime=sourceRows.filter(row=>!exclusions.has(row.path)&&/\.(?:js|mjs|json|html|css|svg)$/.test(row.path));
 for(const excluded of omitted){
  const name=excluded.path.split('/').at(-1);
  for(const consumer of runtime)if(consumer.bytes.toString().includes(name))throw Error('Release QA exclusion is referenced by '+consumer.path+': '+excluded.path);
 }
 return sourceRows.filter(row=>!exclusions.has(row.path));
}
