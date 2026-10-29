import {equipmentPresentation} from './equipment-presentation.js';
// Display only: legendary identity must not change the stored gameplay rarity.
const QUALITY_NAMES=Object.freeze(['普通','稀有','优良','至臻','传说']);
export const equipmentDisplayQuality=item=>equipmentPresentation(item).quality;
export const equipmentDisplayRarity=item=>QUALITY_NAMES[equipmentDisplayQuality(item)];
