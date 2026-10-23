import {mountBattleSlice} from './battle-slice.js';
if(typeof document!=='undefined'&&document.getElementById('battleSlice'))mountBattleSlice(document.getElementById('battleSlice'),{scenario:new URLSearchParams(location.search).get('scenario')==='poison'?'poison':'fire'}).catch(error=>{document.getElementById('battleSlice').textContent='战斗试作尚未就绪：'+error.message;});
