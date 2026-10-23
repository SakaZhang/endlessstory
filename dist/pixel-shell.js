// Responsive disclosure only; never reads or writes game state or persistent storage.
export function bindPixelHeroDisclosure(root=globalThis.document,win=globalThis.window){
 const details=root?.getElementById?.('heroDetails');
 if(!details||typeof win?.matchMedia!=='function')return ()=>{};
 const media=win.matchMedia('(max-width:760px)');let mobileOpen=false,applying=false;
 const apply=()=>{applying=true;details.open=media.matches?mobileOpen:true;applying=false;};
 const toggle=()=>{if(!applying&&media.matches)mobileOpen=!!details.open;};
 apply();details.addEventListener('toggle',toggle);media.addEventListener?.('change',apply);
 return ()=>{details.removeEventListener('toggle',toggle);media.removeEventListener?.('change',apply);};
}
