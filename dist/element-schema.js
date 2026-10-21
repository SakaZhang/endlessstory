// Six-element vocabulary and approved typed damage resolver.
// All twelve flat elemental affixes are approved for the live equipment roll pool.
export const ELEMENT_KEYS=Object.freeze(['earth','water','fire','wind','light','dark']);
export const ELEMENTS=Object.freeze(Object.fromEntries(
 ELEMENT_KEYS.map((key,index)=>[key,Object.freeze({key,name:['地','水','火','风','光','暗'][index]})])
));
export const ELEMENT_AFFIX_DEFS=Object.freeze(Object.fromEntries(
 ELEMENT_KEYS.flatMap(element=>[
  [element+'Atk',Object.freeze({name:ELEMENTS[element].name+'元素攻击',element,kind:'attack',unit:'flat',suffix:'',min:2,max:7,enabled:true})],
  [element+'Resist',Object.freeze({name:ELEMENTS[element].name+'元素抗性',element,kind:'resistance',unit:'flat',suffix:'',min:5,max:12,enabled:true})]
 ])
));

// Typed damage rules; physical damage is intentionally outside this resolver.
export const ELEMENT_COUNTERS=Object.freeze({earth:'water',water:'fire',fire:'wind',wind:'earth',light:'dark',dark:'light'});
export function resolveElementDamage(base,element,attack=0,resistance=0,defenderTags=[]){
 if(!ELEMENT_KEYS.includes(element)||!Number.isFinite(base)||base<0||!Number.isFinite(attack)||attack<0||!Number.isFinite(resistance)||resistance<0)throw new RangeError('Invalid elemental damage component');
 const difference=attack-resistance;
 const countered=Array.isArray(defenderTags)&&defenderTags.includes(ELEMENT_COUNTERS[element]);
 return base*(1+.5*difference/(100+Math.abs(difference)))*(countered?1.1:1);
}
