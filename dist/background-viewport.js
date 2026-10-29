// Runtime framing only: source artwork is never modified. Rectangles use x,y,width,height.
export function backgroundSourceRect(background,width=480,height=270){
 const rect=background?.sourceRect;if(!rect)return null;
 const [x,y,w,h]=rect;if(rect.length!==4||!rect.every(Number.isFinite)||x<0||y<0||w<=0||h<=0)throw new RangeError('Invalid background sourceRect');
 const ratio=width/height,sw=Math.min(w,h*ratio),sh=Math.min(h,w/ratio);
 return [x+(w-sw)/2,y+(h-sh)/2,sw,sh];
}
export function backgroundBaselineY(background,y=203){const r=backgroundSourceRect(background);return r?Math.round((y-r[1])*270/r[3]):y;}
export function drawBattleBackground(context,image,background){
 const r=backgroundSourceRect(background);
 if(r)context.drawImage(image,...r,0,0,480,270);
 else context.drawImage(image,0,0);
}
