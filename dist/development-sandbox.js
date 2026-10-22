// Explicit opt-in development session. It cannot write the official storage object.
export function createDevelopmentSandbox(game){
 const data=new Map(),copy=structuredClone(game);
 const storage={getItem:key=>data.get(String(key))??null,setItem:(key,value)=>data.set(String(key),String(value)),removeItem:key=>data.delete(String(key)),key:index=>[...data.keys()][index]??null,get length(){return data.size;}};
 return {game:copy,storage,createdAt:Date.now()};
}
export function renderDevelopmentNotice(){return '<aside class="developmentNotice"><strong>开发测试 · 不影响正式存档</strong><span>当前角色的独立副本。生命、药剂、战利品和图鉴均不带出；刷新会返回正式旅程。</span><button data-exit-sandbox="1">退出测试</button></aside>';}
