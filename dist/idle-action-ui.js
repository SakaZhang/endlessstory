// Read-only eligibility preview for a host that queues actions at a safe boundary.
// Never pass this preview to a gameplay transaction or persist it.
export function idleActionPreview(s,coordinateIdle=false){
 if(!coordinateIdle||!s.running||s.activeEncounter?.storyScenario||s.developmentEquipmentSandbox)return s;
 return {...s,running:false,activeEncounter:null,dungeonRun:null};
}
export function idleActionQueueHint(s,coordinateIdle=false){
 if(idleActionPreview(s,coordinateIdle)===s)return '';
 return '<p class="subtleText" role="note">挂机中点击行动，将在'+(s.dungeonRun?'本轮副本结束':'本场结束')+'后自动执行；仅查看地图与背包不会停止挂机。</p>';
}
