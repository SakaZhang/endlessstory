import {readFileSync,existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {resolve,dirname,relative,join,normalize} from 'node:path';
import {gzipSync} from 'node:zlib';
import {readTree} from '../build-release.mjs';
import {releaseAssetRows} from '../release-asset-policy.mjs';
import {extendBattleManifest} from '../dist/race-art.js';
import {liveHeroWeaponType,liveSceneBackgrounds} from '../dist/live-battle-view.js';
import {fresh} from '../dist/engine.js';
const baseline=process.argv[2]??'7a32712';
const read=(path,revision)=>revision?execFileSync('git',['show',revision+':dist/'+path]):readFileSync('dist/'+path);
function entryGraph(revision){const paths=new Set(),html=read('index.html',revision).toString(),styles=[...html.matchAll(/<link\b[^>]*href="([^"]+\.css)"/g)].map(m=>m[1].replace(/^\.\//,''));
 function visit(path){if(paths.has(path))return;paths.add(path);for(const match of read(path,revision).toString().matchAll(/(?:^|[;\n])\s*(?:import|export)\s+(?:[^;\n]*?\bfrom\s*)?['"]([^'"]+)['"]/gm))if(match[1].startsWith('.'))visit(relative(resolve('dist'),resolve('dist',dirname(path),match[1])));}
 visit('app.js');const sum=list=>list.reduce((out,path)=>{const bytes=read(path,revision);return {bytes:out.bytes+bytes.length,gzipBytes:out.gzipBytes+gzipSync(bytes).length};},{bytes:0,gzipBytes:0});return {js:{requests:paths.size,...sum([...paths])},css:{requests:styles.length,...sum(styles)}};
}
const sourceRows=await readTree('dist'),releaseRows=releaseAssetRows(sourceRows),report=existsSync('build/release-integrity.json')?JSON.parse(readFileSync('build/release-integrity.json')):null;
const bundle=report?.optimization?.entries.find(entry=>entry.path==='index.html'),emitted=bundle?{js:{requests:1,bytes:bundle.scriptBytes,gzipBytes:gzipSync(readFileSync(join('build','releases',report.release,bundle.script))).length},css:{requests:1,bytes:bundle.styleBytes,gzipBytes:gzipSync(readFileSync(join('build','releases',report.release,bundle.stylesheet))).length}}:null;
const manifest=extendBattleManifest(JSON.parse(readFileSync('dist/battle-assets/manifest.json'))),portraits=[];
for(const race of ['dwarf','human','elf','goblin','ashen']){const state=fresh(race),weapon=liveHeroWeaponType(state),key=manifest.raceHeroWeaponSprites[race]?.[weapon]??manifest.raceHeroSprites[race]??({axe:'dwarf',hammer:'dwarf-hammer'})[weapon]??'hero-neutral',sprite=manifest.sprites[key],before=[...liveSceneBackgrounds({campRace:race,areaId:state.siteId,encounter:{enemies:[]}},manifest),...sprite.frames],after=sprite.frames.filter(frame=>sprite.animations.idle.includes(frame.id));
 const size=rows=>[...new Set(rows.map(row=>normalize('battle-assets/'+row.file)))].reduce((n,path)=>n+readFileSync('dist/'+path).length,0);portraits.push({race,scope:'saved-game camp while viewing world (world map/UI art excluded)',before:{requests:new Set(before.map(row=>row.file)).size,bytes:size(before)},after:{requests:new Set(after.map(row=>row.file)).size,bytes:size(after)}});
}
console.log(JSON.stringify({kind:'static file/ESM graph measurements; gzip is deterministic offline estimate, NOT measured HTTP transfer or user-perceived timing',baseline,baselineEntry:entryGraph(baseline),currentSourceEntry:entryGraph(),optimizedEntry:emitted,source:{files:sourceRows.length,bytes:sourceRows.reduce((n,row)=>n+row.bytes.length,0)},retainedReleaseSource:{files:releaseRows.length,bytes:releaseRows.reduce((n,row)=>n+row.bytes.length,0)},release:report?.release,buildMatchesCurrentSource:report?releaseRows.every(row=>report.files.some(file=>file.path===row.path&&file.sha256===row.sha256)):null,portraits},null,2));
