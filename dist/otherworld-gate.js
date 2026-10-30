import {validStoryEventState} from './story-event-controller.js';
const ENDINGS=Object.freeze({human:'END.H01.human',dwarf:'END.D01.dwarf',elf:'END.E01.elf',goblin:'END.G01.goblin',ashen:'END.A01.ashen'});
export function hasCanonicalEpilogue(s){return validStoryEventState(s)&&!!ENDINGS[s.race]&&s.story?.completedScenes.includes(ENDINGS[s.race])===true&&s.story.flags.includes('EPILOGUE_COMPLETE');}
