import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import { transitionTheme } from '$lib/utils/themeTransitionManager';

// Theme constants
export const THEMES = {
  FORESTRY: 'forestry',
  EVANGELION: 'evangelion',
} as const;

// Theme-specific features
export const THEME_FEATURES = {
  [THEMES.EVANGELION]: {
    monospace: true,
    terminalText: true,
    decorativePatterns: true,
    glassEffects: true,
  },
  [THEMES.FORESTRY]: {
    monospace: false,
    terminalText: false,
    decorativePatterns: false,
    glassEffects: false,
  },
} as const;

// Theme thresholds for automatic switching
export const THEME_THRESHOLDS = {
  [THEMES.EVANGELION]: {
    focus: { min: 8, max: 10 },
    feeling: { min: 1, max: 3 }
  },
  [THEMES.FORESTRY]: {
    focus: { min: 4, max: 6 },
    feeling: { min: 4, max: 6 }
  }
};

// Preset configurations
export const PRESETS = {
  MINIMALIST: { focus: 8, feeling: 2, name: 'Minimalist Wireframe' },
  BALANCED: { focus: 5, feeling: 5, name: 'Balanced Productivity' },
  CREATIVE: { focus: 3, feeling: 8, name: 'Creative Mapping' },
} as const;

// Initialize from localStorage if available
const initialFocus = browser ? 
  parseInt(localStorage.getItem('theme-focus') || '5') : 5;
const initialFeeling = browser ? 
  parseInt(localStorage.getItem('theme-feeling') || '5') : 5;

// Create stores
export const focusLevel = writable(initialFocus);
export const feelingLevel = writable(initialFeeling);

// Derived store for current theme based on focus/feeling values
export const currentTheme = derived(
  [focusLevel, feelingLevel],
  ([$focusLevel, $feelingLevel]) => {
    // Determine theme based on focus/feeling thresholds
    if ($focusLevel >= THEME_THRESHOLDS[THEMES.EVANGELION].focus.min && 
        $focusLevel <= THEME_THRESHOLDS[THEMES.EVANGELION].focus.max &&
        $feelingLevel >= THEME_THRESHOLDS[THEMES.EVANGELION].feeling.min && 
        $feelingLevel <= THEME_THRESHOLDS[THEMES.EVANGELION].feeling.max) {
      return THEMES.EVANGELION;
    }
    return THEMES.FORESTRY; // Default theme
  }
);

// Derived store for theme features
export const themeFeatures = derived(
  currentTheme,
  $currentTheme => THEME_FEATURES[$currentTheme]
);

// Derived store for theme class
export const themeClass = derived(
  currentTheme,
  $currentTheme => $currentTheme !== THEMES.FORESTRY ? `theme-${$currentTheme}` : ''
);

// Derived store for theme styles
export const themeStyles = derived(
  [focusLevel, feelingLevel],
  ([$focus, $feeling]) => ({
    '--focus-level': $focus,
    '--feeling-level': $feeling
  })
);

// Save theme settings to localStorage
if (browser) {
  // Save focus/feeling values when they change
  focusLevel.subscribe(value => {
    localStorage.setItem('theme-focus', value.toString());
  });
  
  feelingLevel.subscribe(value => {
    localStorage.setItem('theme-feeling', value.toString());
  });
}

// Apply a preset with transition
export function applyPreset(presetKey: keyof typeof PRESETS): void {
  const preset = PRESETS[presetKey];
  if (preset) {
    transitionTheme(() => {
      focusLevel.set(preset.focus);
      feelingLevel.set(preset.feeling);
    }, 300);
  }
}

// Helper function to get current theme state
export function getCurrentThemeState() {
  return {
    theme: get(currentTheme),
    focus: get(focusLevel),
    feeling: get(feelingLevel),
    features: get(themeFeatures)
  };
} 