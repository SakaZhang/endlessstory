// Equipment quality is a background; green frames denote set membership only.
export const EQUIPMENT_QUALITY_BACKGROUNDS=Object.freeze(['#555b61','#21476a','#49305e','#682d36','#61502a']);
export const EQUIPMENT_NEUTRAL_FRAME='#48515a';
export const EQUIPMENT_SET_FRAME='#6aaf70';
export function equipmentPresentation(item){const isSet=Boolean(item?.set||item?.setId);const quality=isSet?3:Number.isInteger(item?.rarity)&&item.rarity>=0&&item.rarity<=4?item.rarity:0;return {quality,isSet,background:EQUIPMENT_QUALITY_BACKGROUNDS[quality],border:isSet?EQUIPMENT_SET_FRAME:EQUIPMENT_NEUTRAL_FRAME};}
export function frameEquipmentSVG(svg,item,grid=32){const p=equipmentPresentation(item),unit=grid/32;return svg.replace('<svg ',`<svg data-equipment-quality="${p.quality}" data-equipment-set="${p.isSet}" `).replace(/(<svg[^>]*>)/,`$1<rect data-quality-background="true" x="0" y="0" width="${grid}" height="${grid}" fill="${p.background}"/><rect data-equipment-frame="true" x="${unit/2}" y="${unit/2}" width="${grid-unit}" height="${grid-unit}" fill="none" stroke="${p.border}" stroke-width="${unit}"/>`);}
