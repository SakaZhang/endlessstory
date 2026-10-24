// Presentation-only calibration of independently authored source pixel densities.
// One idle-reference scale per sprite is reused for every lifecycle frame; never
// normalize individual attack/death bounds (that causes animation size popping).
// Source PNGs, anchors, collision/combat data and other races remain unchanged.
export const HERO_REFERENCE_HEIGHTS=Object.freeze({goblin:62,elf:98});
export function heroPresentationScale(sprite,race){
 const frame=sprite?.frames?.find(f=>f.id===sprite.animations?.idle?.[0]);
 const box=frame?.solidBBox??frame?.alphaBBox;
 if(!box)return 1;
 const height=box[3]-box[1]+1;
 return HERO_REFERENCE_HEIGHTS[race]?HERO_REFERENCE_HEIGHTS[race]/height:Math.min(1,94/height);
}
