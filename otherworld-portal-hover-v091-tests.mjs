import assert from 'node:assert/strict';
import fs from 'node:fs';
// Keep the centered map hit target anchored in every button interaction state.
// A global button:hover translateY otherwise replaces the centering transform.
const css=fs.readFileSync('dist/otherworld-ui.css','utf8').replace(/\/\*[\s\S]*?\*\//g,'');
for(const state of ['hover','active','focus-visible','disabled']) {
 const rules=[...css.matchAll(/([^{}]+)\{([^{}]+)\}/g)];
 assert(rules.some(([,selectors,body])=>selectors.split(',').some(s=>s.trim()===`.otherworldPortal:${state}`)&&/transform\s*:\s*translate\(-50%,\s*-50%\)/.test(body)),`portal ${state} must preserve map anchoring with higher specificity than button:${state}`);
}
assert.match(css,/\.otherworldPortal:focus-visible\{outline:/,'keyboard focus remains visible');
console.log('PASS map portal preserves centered hit target across hover, active, keyboard focus and disabled states.');
