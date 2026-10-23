import {icon} from './icons.js';
import * as Engine from './engine.js';
import {PLANNED_AREAS,areaGearLevel} from './location-schema.js';
import {MONSTER_CATALOG,monsterMaterialPool} from './monster-codex-schema.js';
import {DWARF_MATERIALS,resolveDwarfMaterialId} from './dwarf-material-catalog.js';
import {renderLegacyHandoff as legacyHandoff} from './dwarf-region-ui.js';
import {discoveredMaterials} from './adjacent-region-discovery.js';
const esc = x => String(x ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const canBrowse = a => !!a?.implemented && !!a.visible && !!a.unlocked;
const range = r => Array.isArray(r) ? r.join('–') : '—';
export function travelBlockReason(node, snapshot) {
  if (!node?.enabled) return '地点尚未开放';
  if (!node.unlocked) return '先通关前一区域普通副本';
  if (!node.budgetReady) return '配置准备中';
  if (node.readyAt > snapshot.now) return '地点冷却中';
  if (snapshot.resting) return '正在休息';
  if (snapshot.running || snapshot.inBattle || snapshot.inDungeon) return '请先完成当前战斗并停止远征';
  if (snapshot.migration?.legacyDrain) return '旧旅程正在收尾';
  return '';
}
export function buildRegionModel(snapshot, ui) {
  const area = snapshot.areas.find(a=>a.id===ui.viewAreaId && canBrowse(a));
  if (!area) return {unavailable:true, migration:snapshot.migration};
  const nodes = snapshot.nodes.filter(n=>n.areaId===area.id && n.enabled).map(n=>({id:n.id,name:n.name,kind:n.kind,unlocked:n.unlocked,focused:n.unlocked && snapshot.sourceFocus===n.id}));
  const edges = (snapshot.adjacency[area.id] ?? []).map(edge=>{
    const a = snapshot.areas.find(a=>a.id===edge.areaId);
    return {side:edge.side,areaId:canBrowse(a)?a.id:null,label:!a?.implemented?'前路未开放':!a.visible||!a.unlocked?'迷雾 · 尚未解锁':a.name};
  });
  const travel = snapshot.areas.filter(a=>canBrowse(a) && snapshot.exploredAreaIds.includes(a.id)).map(a=>({id:a.id,name:a.name}));
  const favorites = [...new Set(snapshot.favoriteNodeIds??[])].map(id=>{const n=snapshot.nodes.find(n=>n.id===id);const available=!!n?.enabled&&n.unlocked&&canBrowse(snapshot.areas.find(a=>a.id===n.areaId));return {id,available,name:available?n.name:'地点不可用',areaId:available?n.areaId:null,cooldownSeconds:available?Math.max(0,Math.ceil(((n.readyAt??0)-snapshot.now)/1000)):null};});
  const node = snapshot.nodes.find(n=>n.id===ui.previewNodeId && nodes.some(v=>v.id===n.id));
  // Never copy a raw catalog, pool or unknown definition into render data.
  const preview = node ? {id:node.id,name:node.name,levelRange:node.levelRange,gearLevelRange:Number.isFinite(areaGearLevel(node.id))?[Math.max(node.levelRange[0],areaGearLevel(node.id)-2),Math.min(node.levelRange[1],areaGearLevel(node.id)+2)]:null,
    monsters:(snapshot.monstersByNode[node.id]??[]).map(m=>snapshot.encounteredMonsterIds.includes(m.id)?{name:m.name,skills:(m.skills??[]).map(s=>({name:s.name,description:s.description}))}:{name:'未知怪物',silhouette:true,skills:[]}),
    materials:discoveredMaterials(snapshot.discoveryLedger,snapshot.materialIdsByNode[node.id]??[],snapshot.materialCatalog),
    favorite:(snapshot.favoriteNodeIds??[]).includes(node.id),cooldownSeconds:Math.max(0,Math.ceil(((node.readyAt??0)-snapshot.now)/1000)),blocked:travelBlockReason(node,snapshot)} : null;
  return {area:{id:area.id,name:area.name,levelRange:area.levelRange},nodes,edges,travel,favorites,preview,travelPanelOpen:ui.travelPanelOpen,migration:snapshot.migration,error:ui.error??'',pending:!!ui.pending,favoritePending:!!ui.favoritePending};
}
const button = (action,id,label,disabled=false,extra='') => `<button type="button" data-region-action="${action}" data-region-id="${esc(id)}" ${disabled?'disabled':''} ${extra}>${label}</button>`;
export function renderRegion(model,{renderLegacyHandoff=legacyHandoff}={}) {
  const legacy=renderLegacyHandoff(model.migration);
  if(model.unavailable) return legacy+'<p role="status">区域尚不可浏览</p>';
  return legacy+`<section class="adjacentRegion"><header><h2>${esc(model.area.name)}</h2><p>推荐 ${esc(range(model.area.levelRange))} 级 · 推荐等级不是进入限制</p></header><div class="localMap" aria-label="当前区域地图"><canvas width="960" height="540" data-region-canvas aria-label="${esc(model.area.name)}地形"></canvas><nav class="regionEdges" aria-label="相邻区域">${model.edges.map(e=>button('edge',e.areaId??'',esc(e.label),!e.areaId,`class="edge ${e.side==='left'?'left':'right'}"`)).join('')}</nav><div class="localNodes">${model.nodes.map(n=>button('node',n.id,`<span>${esc(({field:'野外',dungeon:'普通副本',boss:'首领副本'})[n.kind]??'地点')}</span><b>${esc(n.name)}</b>`,!n.unlocked,`class="localNode ${esc(n.kind)} ${n.focused?'sourceFocused':''}"`)).join('')}</div></div>${button('toggle','','旅行',false,`aria-expanded="${model.travelPanelOpen}"`)}${model.travelPanelOpen?`<nav aria-label="已探索区域">${model.travel.map(a=>button('travel',a.id,esc(a.name),false,`aria-current="${a.id===model.area.id?'location':'false'}"`)).join('')||'<p>暂无已记录的探索区域</p>'}</nav><h3>收藏地点</h3><div>${model.favorites.map(f=>button('favoritePreview',f.id,esc(f.name)+(f.available?' · 冷却 '+f.cooldownSeconds+' 秒':''),!f.available)+button('removeFavorite',f.id,'取消收藏',model.favoritePending,`aria-label="取消收藏${esc(f.name)}"`)).join('')||'<p>暂无收藏地点</p>'}</div>`:''}<p role="status">${esc(model.error)}</p>${model.preview?`<section class="nodePreview" aria-label="地点预览"><h3>${esc(model.preview.name)}</h3>${button('close','','关闭预览')}${button('favorite',model.preview.id,model.preview.favorite?'★ 已收藏':'☆ 收藏地点',model.favoritePending,`aria-pressed="${model.preview.favorite}" aria-label="${model.preview.favorite?'取消收藏':'收藏'}${esc(model.preview.name)}"`)}<p>推荐 ${esc(range(model.preview.levelRange))} 级</p>${model.preview.gearLevelRange?`<p>装备掉落等级 ${esc(range(model.preview.gearLevelRange))}</p>`:''}<h4>怪物</h4><ul>${model.preview.monsters.map(m=>`<li>${m.silhouette?'<span aria-hidden="true">◼</span> ':''}${esc(m.name)}${m.skills.map(s=>`<p>${esc(s.name)}：${esc(s.description)}</p>`).join('')}</li>`).join('')}</ul><h4>已发现材料</h4><ul>${model.preview.materials.map(m=>`<li><span class="discoveredMaterialIcon" aria-hidden="true">${icon(m.icon||'ore')}</span>${esc(m.name)}</li>`).join('')}</ul><p>剩余冷却 ${model.preview.cooldownSeconds} 秒</p><p role="status">${esc(model.error||model.preview.blocked)}</p>${button('confirm',model.preview.id,model.pending?'正在前往…':'前往',model.pending||!!model.preview.blocked)}</section>`:''}</section>`;
}
// No timers, save writes, RNG or combat calls. Host calls refresh on its normal clock.
export function mountRegion(host, adapter, initialArea, initialUi={}) {
  const ui={viewAreaId:initialUi.viewAreaId??initialArea,previewNodeId:initialUi.previewNodeId??null,travelPanelOpen:!!initialUi.travelPanelOpen,error:'',pending:false,favoritePending:false};
  if(!Object.hasOwn(initialUi,'previewNodeId')){const initial=adapter.read();if(initial.sourceFocus&&buildRegionModel(initial,ui).nodes?.some(n=>n.id===initial.sourceFocus&&n.unlocked))ui.previewNodeId=initial.sourceFocus;}
  let disposed=false;
  const refresh=()=>{
    const focused=host.ownerDocument?.activeElement;
    const focusKey=focused&&host.contains(focused)?{...focused.dataset}:null;
    const model=buildRegionModel(adapter.read(),ui);host.innerHTML=renderRegion(model,adapter);adapter.draw?.(host,model.area);
    if(focusKey?.regionAction){const next=[...(host.querySelectorAll?.('[data-region-action]')??[])].find(b=>b.dataset.regionAction===focusKey.regionAction&&b.dataset.regionId===focusKey.regionId&&!b.disabled);next?.focus({preventScroll:true});}
    return model;
  };
  const click=async event=>{
    const b=event.target.closest?.('[data-region-action]');
    if(!b||!host.contains(b)||b.disabled||disposed)return;
    const {regionAction:action,regionId:id}=b.dataset;
    const snapshot=adapter.read(), model=buildRegionModel(snapshot,ui);
    if(action==='toggle')ui.travelPanelOpen=!ui.travelPanelOpen;
    else if(action==='close'){ui.previewNodeId=null;ui.error='';}
    else if(action==='edge'||action==='travel'){
      const valid=action==='edge'?model.edges?.some(e=>e.areaId===id):ui.travelPanelOpen&&model.travel?.some(a=>a.id===id);
      if(!valid||ui.viewAreaId===id)return;
      ui.viewAreaId=id;ui.previewNodeId=null;ui.error='';adapter.selectArea?.(id);
    } else if(action==='favoritePreview'){
      const f=model.favorites?.find(f=>f.id===id&&f.available);if(!ui.travelPanelOpen||!f)return;
      ui.viewAreaId=f.areaId;ui.previewNodeId=id;ui.error='';adapter.selectArea?.(f.areaId);adapter.selectNode?.(id);
    } else if(action==='favorite'||action==='removeFavorite'){
      if(ui.favoritePending||typeof adapter.setFavorite!=='function')return;
      const remove=action==='removeFavorite';
      if(remove?!model.favorites?.some(f=>f.id===id):model.preview?.id!==id)return;
      const desired=!remove&&!model.preview.favorite;ui.favoritePending=true;ui.error='';refresh();
      try {const result=await adapter.setFavorite(id,desired);if(!result?.ok)ui.error=result?.reason||'收藏保存失败';}
      catch {ui.error='收藏保存失败';}finally {ui.favoritePending=false;}
    } else if(action==='node'){
      if(!model.nodes?.some(n=>n.id===id&&n.unlocked))return;
      ui.previewNodeId=id;ui.error='';adapter.selectNode?.(id);
    } else if(action==='confirm'){
      if(ui.pending||ui.previewNodeId!==id||model.preview?.id!==id)return;
      const node=snapshot.nodes.find(n=>n.id===id);
      ui.error=travelBlockReason(node,snapshot);
      if(ui.error){refresh();return;}
      ui.pending=true;refresh();
      try {
        // commitTravel MUST revalidate atomically inside the authoritative transaction.
        const result=await adapter.commitTravel(id);
        if(result?.ok){if(ui.previewNodeId===id)ui.previewNodeId=null;}else ui.error=result?.reason||'当前不能前往';
      } catch {ui.error='前往失败，未确认启程';}
      finally {ui.pending=false;}
    } else return;
    if(!disposed)refresh();
  };
  host.addEventListener('click',click);refresh();
  return {refresh,getUI:()=>({...ui}),dispose(){disposed=true;host.removeEventListener('click',click);}};
}

// Production schema adapter. Explicit overrides support fixtures and staged engine integration.
// This query never backfills/mutates saves and never equates unlocked with explored.
export function buildRegionSnapshot(s, now=Date.now(), sourceFocus=null, overrides={}) {
  const nodes=overrides.nodes??Engine.plannedNodes(s,now);
  const navigation=Engine.getRegionNavigation(s)??{exploredAreaIds:[],favoriteNodeIds:[],discoveryLedger:{version:1,discovered:{}}};
  const exploredAreaIds=overrides.exploredAreaIds??navigation.exploredAreaIds;
  const visibleAreaIds=overrides.visibleAreaIds??Object.values(PLANNED_AREAS).map(a=>a.id);
  const areas=Object.values(PLANNED_AREAS).map(a=>({...a,implemented:true,visible:visibleAreaIds.includes(a.id),unlocked:nodes.some(n=>n.areaId===a.id&&n.unlocked)}));
  const monstersByNode=Object.fromEntries(nodes.map(n=>[n.id,Object.values(MONSTER_CATALOG).filter(m=>m.sources.includes(n.id))]));
  const materialIdsByNode=Object.fromEntries(nodes.map(n=>[n.id,[...new Set(monstersByNode[n.id].flatMap(m=>monsterMaterialPool(m.id,n.id)).map(resolveDwarfMaterialId).filter(Boolean))]]));
  return {now,nodes,areas,sourceFocus,exploredAreaIds:[...exploredAreaIds],favoriteNodeIds:[...(overrides.favoriteNodeIds??navigation.favoriteNodeIds)],
    adjacency:{'dwarf.a01':[{areaId:'dwarf.a02',side:'right'}],'dwarf.a02':[{areaId:'dwarf.a01',side:'left'},{areaId:'dwarf.a03',side:'right'}],'dwarf.a03':[{areaId:'dwarf.a02',side:'left'},{areaId:'dwarf.a04',side:'right'}]},
    monstersByNode,materialIdsByNode,materialCatalog:DWARF_MATERIALS,
    encounteredMonsterIds:Object.keys(s.monsterLedger?.encountered??{}).filter(id=>s.monsterLedger.encountered[id]===true),
    discoveryLedger:overrides.discoveryLedger??navigation.discoveryLedger,migration:s.contentMigration,
    resting:overrides.resting??((s.restUntil??0)>Math.max(now,s.lastHealthClock??0)),running:!!s.running,inBattle:!!s.activeEncounter&&!s.activeEncounter.done,inDungeon:!!s.dungeonRun};
}
