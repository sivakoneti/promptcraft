import presetsData from '../library/presets.json' with { type: 'json' };
import { validateLibrary } from './state.js';

export const embeddedPresetLibrary = validateLibrary(presetsData);
