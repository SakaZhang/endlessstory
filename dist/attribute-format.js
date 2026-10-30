// Presentation only: never quantize stored attributes or combat calculations.
export const formatAttribute=value=>Number.isFinite(value)?String(Math.round(value)):'—';
export const formatAttributePercent=value=>{
 if(!Number.isFinite(value))return '—';
 const percent=value*100;
 // Keep tiny nonzero rates distinguishable from zero without decimal digits.
 if(percent!==0&&Math.abs(percent)<1)return percent<0?'负值（绝对值不足1%）':'不足1%';
 return formatAttribute(percent)+'%';
};
