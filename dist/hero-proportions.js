// Presentation-only calibration of independently authored source pixel densities.
// One idle-reference scale per sprite is reused for every lifecycle frame; never
// normalize individual attack/death bounds (that causes animation size popping).
// Source PNGs, anchors, collision/combat data and other races remain unchanged.
export const HERO_REFERENCE_HEIGHTS=Object.freeze({goblin:62,elf:98});
// Portraits and selection cards face right like the default camp/battle hero.
// Read authored facing (including per-frame overrides); never rewrite the PNG.
export const heroPortraitFlipX=(sprite,frame)=>(frame?.facing??sprite?.facing)==='left';
// Inclusive head/hood-to-foot Y bounds, visually inspected in the idle PNG.
// Staff tip is NOT anatomy: elf staff alpha starts92 but hair starts101.
export const HERO_BODY_REFERENCE_BOUNDS=Object.freeze({
 elf:Object.freeze({bow:[94,175],staff:[101,175],neutral:[95,176]}),
 goblin:Object.freeze({dagger:[39,176],sword:[52,176],neutral:[39,176]})
});
export function heroPresentationScale(sprite,race){
 const frame=sprite?.frames?.find(f=>f.id===sprite.animations?.idle?.[0]);
 const box=frame?.solidBBox??frame?.alphaBBox;
 if(!box)return 1;
 const body=sprite.bodyReferenceBounds;
 const height=body?body[1]-body[0]+1:box[3]-box[1]+1;
 return HERO_REFERENCE_HEIGHTS[race]?HERO_REFERENCE_HEIGHTS[race]/height:Math.min(1,94/height);
}
