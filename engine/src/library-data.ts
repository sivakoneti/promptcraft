import presetsData from '../library/presets.json' with { type: 'json' };
import type { PresetLibrary } from './state.js';

export const embeddedPresetLibrary: PresetLibrary = presetsData as PresetLibrary;
