// Test process only. Never imported by production. Deliberately weak deterministic
// budgets test UI routing/state transitions, not content balance or reviewed rates.
exports.installM2UiFixture=async function({fieldGroupChance=0,hp=150}={}){
 const E=await import('./dist/engine.js'),{DWARF_MONSTERS}=await import('./dist/dwarf-content.js');
 const config={id:'m2-ui-test-only',testOnly:true,reviewed:false,fieldGroupChance,
  clearRewards:Object.fromEntries([1,2,3].map(n=>[n,{gold:20,xp:40,materialRounds:1,gearChance:.35,markChance:.02}])),
  monsters:Object.fromEntries(Object.keys(DWARF_MONSTERS).map(id=>[id,{hp,atk:5,armor:10,elementalPower:7,rewardGold:4,rewardXp:20,basicIntervalMs:2200}]))};
 if(!E.configureDwarfParameters(config))throw Error('M2 UI fixture rejected');return config;
};
