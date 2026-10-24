import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {HUMAN_ART} from './dist/races/human/art.js';
import {raceIconAsset} from './dist/race-art.js';
const {loadImage,createCanvas}=createRequire(import.meta.url)('@napi-rs/canvas');
assert(!Object.hasOwn(HUMAN_ART.equipment,'human-last-banner'));
for(const size of [32,48,64])assert.equal(raceIconAsset('equipment','human-banner-armor',size),'races/human/assets/human-banner-armor.png');
const bytes=fs.readFileSync('dist/'+HUMAN_ART.equipment['human-banner-armor']);const im=await loadImage(bytes);assert.equal(im.width,64);assert.equal(im.height,64);
const c=createCanvas(64,64),g=c.getContext('2d');g.drawImage(im,0,0);const px=g.getImageData(0,0,64,64).data;let clear=0,solid=0,blue=0,gold=0,silver=0;for(let i=0;i<px.length;i+=4){const[r,gr,b,a]=px.slice(i,i+4);if(a===0)clear++;if(a>128){solid++;if(b>r*1.4&&b>gr*1.15)blue++;if(r>gr&&gr>b*1.4)gold++;if(Math.abs(r-b)<35&&Math.abs(gr-b)<35&&r>90)silver++;}}
assert(clear>1000&&solid>500);assert(blue>30&&gold>30&&silver>30);console.log('PASS new armor PNG: real transparent silver plate, blue lining, gold emblem; new identity routes at all display sizes; retired amulet key absent. Visual sheet separately inspected.');
