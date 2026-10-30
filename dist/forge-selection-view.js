// A selection is not navigation: keep the shelf, page and keyboard position
// while the normal render refreshes counts, orbit slots and fusion probabilities.
export function renderForgeSelection(root, render, doc=globalThis.document){
 const selectors=['.pixelForgeInputs','.fusionInputPicker','.materialStackGrid','.fusionGearGrid'];
 const shelves=selectors.map(selector=>{const node=root?.querySelector?.(selector);return {selector,top:node?.scrollTop??0,left:node?.scrollLeft??0};});
 const ancestors=[];
 for(let node=root;node;node=node.parentElement)ancestors.push([node,node.scrollTop??0,node.scrollLeft??0]);
 if(doc?.scrollingElement&&!ancestors.some(([node])=>node===doc.scrollingElement))ancestors.push([doc.scrollingElement,doc.scrollingElement.scrollTop,doc.scrollingElement.scrollLeft]);
 const active=doc?.activeElement,focusKey=['material','fusionGear','remove','forgeclear'].find(key=>active?.dataset?.[key]!==undefined);
 const focused=focusKey&&root?.contains?.(active)?{key:focusKey,value:active.dataset[focusKey]}:null;
 const rulesOpen=root?.querySelector?.('.fusionRules')?.open;
 render();
 const rules=root?.querySelector?.('.fusionRules');if(rules&&rulesOpen!==undefined)rules.open=rulesOpen;
 if(focused){
  const button=Array.from(root?.querySelectorAll?.('button')??[]).find(node=>node.dataset?.[focused.key]===focused.value);
  // Selected gear becomes disabled. Keep keyboard users at the picker instead
  // of silently dropping focus onto the page body.
  const target=button&&!button.disabled?button:root?.querySelector?.('.fusionInputPicker');
  if(target){if(target!==button)target.tabIndex=-1;target.focus?.({preventScroll:true});}
 }
 for(const {selector,top,left} of shelves){const node=root?.querySelector?.(selector);if(node){node.scrollTop=top;node.scrollLeft=left;}}
 // Restore outer scrollers last, including the document on narrow screens.
 for(const [node,top,left] of ancestors){node.scrollTop=top;node.scrollLeft=left;}
}
