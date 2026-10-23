import {utilityIcon} from './consumable-pixel-art.js';
import {icon} from './icons.js';
import {uiPixelIcon} from './ui-pixel-icons.js';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const TABS=Object.freeze([['fusion','action-fusion','融合'],['modify','action-reforge','改造'],['enhancement','action-enhance','强化'],['recipes','recipeBook','配方']]);
// Pure presentation: the existing data actions remain the sole transaction path.
export function renderPixelForgeTabs(active){return `<nav class="forgeTabs pixelServiceTabs" aria-label="锻坊工序">${TABS.map(([id,image,label])=>`<button type="button" data-forgetab="${id}" class="${active===id?'active':''}" aria-pressed="${active===id}">${image.startsWith('action-')?uiPixelIcon(image):utilityIcon(image,{size:32})}<span>${label}</span></button>`).join('')}</nav>`;}
export function serviceDetails(label,body){return `<details class="pixelServiceDetails"><summary>${esc(label)}</summary><div class="pixelServiceDetailsBody">${body}</div></details>`;}
export function serviceNotice(text){return `<p class="pixelServiceNotice">${esc(text)}</p>`;}
