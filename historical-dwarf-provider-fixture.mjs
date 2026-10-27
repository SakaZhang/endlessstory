// Archived released providers, not regenerated from today's production values.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const releases={
 m3:['4e1a6a5e762dd62b501d82e9fdfd85178b093f58','efda5aa4fe1e60f7c564378b2cd6fe95898b95eeea057f438139a0c2b3a3096a'],
 m4:['603f82970b5270a41f0a6b18f5ddd4677e5cc57e','6307ee6043a223f79c282274422c8fb227060af37503cf3eb1de2c346b6dbcae'],
};
export function historicalDwarfProvider(release){
 const [commit,hash]=releases[release];
 const bytes=readFileSync(new URL(`./fixtures/dwarf-providers/${release}.json`,import.meta.url));
 const provenance=JSON.parse(readFileSync(new URL(`./fixtures/dwarf-providers/${release}-provenance.json`,import.meta.url)));
 assert.equal(provenance.sourceCommit,commit);
 assert.equal(provenance.fixtureSha256,hash);
 assert.equal(createHash('sha256').update(bytes).digest('hex'),hash,'immutable historical released provider');
 return {provider:JSON.parse(bytes),provenance};
}
