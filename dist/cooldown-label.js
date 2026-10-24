// Presentation only: combat cooldown storage uses 1100ms scheduler ticks.
// Do not change the stored tick count or gameplay cadence here.
export function cooldownDisplaySeconds(ticks){return Number.isFinite(ticks)&&ticks>0?Math.ceil(ticks*1100/1000):0;}
