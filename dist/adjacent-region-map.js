import {drawDwarfArea,dwarfAreaIndex} from './dwarf-area-art.js';
// Reuse actual single-area pixel scenery. Its native art bounds are 960 × 310.
export function drawAdjacentRegion(host, area) {
  const canvas=host?.querySelector?.('[data-region-canvas]');
  if(!canvas||!area)return false;
  const index=dwarfAreaIndex(area.id),c=canvas.getContext?.('2d');
  if(index===null||!c)return false;
  c.save();c.clearRect(0,0,canvas.width,canvas.height);
  c.scale(canvas.width/960,canvas.height/310);c.imageSmoothingEnabled=false;
  drawDwarfArea(c,index,0);c.restore();return true;
}
