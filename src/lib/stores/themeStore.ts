import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';

// Theme constants
export const THEMES = {
  FORESTRY: 'forestry',
  EVANGELION: 'evangelion',
} as const;

export type Theme = typeof THEMES[keyof typeof THEMES];

export const PRESETS = {
  MINIMALIST: { focus: 8, feeling: 2, name: 'Minimalist Wireframe' },
  BALANCED: { focus: 5, feeling: 5, name: 'Balanced Productivity' },
  CREATIVE: { focus: 3, feeling: 8, name: 'Creative Mapping' },
} as const;

export type Preset = keyof typeof PRESETS;

// Initialize from localStorage if available
const initialTheme = browser ? 
  (localStorage.getItem('theme-name') as Theme || THEMES.FORESTRY) : THEMES.FORESTRY;
const initialFocus = browser ? 
  parseInt(localStorage.getItem('theme-focus') || '5') : 5;
const initialFeeling = browser ? 
  parseInt(localStorage.getItem('theme-feeling') || '5') : 5;

// Create stores
export const themeName = writable<Theme>(initialTheme);
export const focusLevel = writable<number>(initialFocus);
export const feelingLevel = writable<number>(initialFeeling);

// Derived store for computed theme values
export const themeValues = derived(
  [focusLevel, feelingLevel],
  ([$focusLevel, $feelingLevel]) => {
    return {
      shadowStrength: $focusLevel * 0.01,
      borderRadius: Math.max(0.25, 0.5 - ($focusLevel * 0.03)),
      spacingFactor: 1 - (($focusLevel - 5) * 0.05),
      animationSpeed: 300 - (($focusLevel - 5) * 30),
      colorSaturation: 100 - ((10 - $feelingLevel) * 8),
      decorationOpacity: $feelingLevel * 0.1,
    };
  }
);

// Apply theme changes when stores update
if (browser) {
  // Theme name change handler
  themeName.subscribe(value => {
    // Remove all theme classes
    document.documentElement.classList.remove(
      ...Object.values(THEMES).map(theme => `theme-${theme}`)
    );
    
    // Add current theme class if not default
    if (value !== THEMES.FORESTRY) {
      document.documentElement.classList.add(`theme-${value}`);
    }
    
    localStorage.setItem('theme-name', value);
  });
  
  // Focus/Feeling change handler
  const updateThemeVariables = () => {
    const focus = get(focusLevel);
    const feeling = get(feelingLevel);
    
    document.documentElement.style.setProperty('--focus-level', focus.toString());
    document.documentElement.style.setProperty('--feeling-level', feeling.toString());
    
    localStorage.setItem('theme-focus', focus.toString());
    localStorage.setItem('theme-feeling', feeling.toString());
  };
  
  focusLevel.subscribe(updateThemeVariables);
  feelingLevel.subscribe(updateThemeVariables);
}

// Apply a preset
export function applyPreset(presetKey: Preset) {
  const preset = PRESETS[presetKey];
  if (preset) {
    focusLevel.set(preset.focus);
    feelingLevel.set(preset.feeling);
  }
}

// Helper function to get current theme state
export function getCurrentThemeState() {
  return {
    theme: get(themeName),
    focus: get(focusLevel),
    feeling: get(feelingLevel),
  };
} 