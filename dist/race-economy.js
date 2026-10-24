// Actor-specific service pricing. Materials, quantities, rewards and sale prices are unchanged.
export function racialGoldCost(s,base){if(!Number.isSafeInteger(base)||base<0)return null;return s?.race==='human'&&base>0?Math.max(1,Math.ceil(base*.9)):base;}
