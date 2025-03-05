# UI Development v2: Dynamic Theming System

This document details the implementation approach for the theming system described in Section 4 of the UI-Dev-V2 document, providing a comprehensive roadmap for developers.

## 1. Theming System Requirements Overview

The theming system needs to support:

1. **Dynamic Theme Variables**: CSS custom properties that respond to user adjustments
2. **Dual-Dimension Controls**:
   - Focus (1-10): Affects layout density, contrast, animation speed
   - Feeling (1-10): Affects color saturation, shape organicity, decorative elements
3. **Theme Presets**: Pre-configured combinations (Minimalist, Balanced, Creative)
4. **Smooth Transitions**: Visual continuity when switching themes
5. **Persistence**: Saving user preferences
6. **Monospace Typography**: Terminal-like text styling for sci-fi themes (see [Code Influences](./code-influences.md))

## 2. Technical Implementation Approach

### 2.1 CSS Variables + Svelte Stores Approach

**Pros:**
- Native CSS support
- Excellent performance
- Simple implementation
- Works well with Tailwind
- Supports dynamic component-level changes
- Enables smooth transitions between states

**Cons:**
- Limited to CSS properties
- Requires careful organization
- Need to manage complex state relationships

**Implementation:**
```javascript
// src/lib/stores/themeStore.js
import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

// Initial values (possibly from localStorage)
const initialFocus = browser ? 
  parseInt(localStorage.getItem('theme-focus') || '5') : 5;
const initialFeeling = browser ? 
  parseInt(localStorage.getItem('theme-feeling') || '5') : 5;

// Create stores
export const focusLevel = writable(initialFocus);
export const feelingLevel = writable(initialFeeling);

// Derived store for computed theme values
export const themeValues = derived(
  [focusLevel, feelingLevel],
  ([$focusLevel, $feelingLevel]) => {
    // Calculate derived values based on focus/feeling
    return {
      shadowStrength: $focusLevel * 0.01,
      borderRadius: Math.max(0.25, 0.5 - ($focusLevel * 0.03)) + 'rem',
      colorSaturation: $feelingLevel * 10,
      // More calculated properties...
    };
  }
);

// Observer to update CSS variables
if (browser) {
  themeValues.subscribe(values => {
    // Update CSS variables
    document.documentElement.style.setProperty('--shadow-strength', values.shadowStrength);
    document.documentElement.style.setProperty('--border-radius', values.borderRadius);
    document.documentElement.style.setProperty('--color-saturation', values.colorSaturation + '%');
    // More property updates...
    
    // Save to localStorage
    localStorage.setItem('theme-focus', focusLevel.toString());
    localStorage.setItem('theme-feeling', feelingLevel.toString());
  });
}
```

## 3. Recommended Approach: CSS Variables + Theme Classes

After analyzing the options, a hybrid approach combining CSS variables with theme classes offers the best balance of flexibility, performance, and maintainability for your SvelteKit + Tailwind application.

```css
/* src/lib/styles/themes.css */
:root {
  /* Base Theme (Forestry) */
  --focus-level: 5;
  --feeling-level: 5;
  
  /* Base Colors */
  --color-primary: #2C3830; /* shadow-moss */
  --color-background: #F6F4EF; /* speed-of-light */
  --color-text: #1B1E1E; /* mariana-black */
  --color-accent: #AA8344; /* walnut-shell */
  --color-highlight: #D3BA75; /* good-as-gold */
  --color-secondary: #47553C; /* green-tone-ink */
  
  /* Dynamically calculated values */
  --shadow-strength: calc(var(--focus-level) * 0.01);
  --border-radius: calc(max(0.25rem, 0.5rem - (var(--focus-level) * 0.03rem)));
  --spacing-factor: calc(1 - ((var(--focus-level) - 5) * 0.05));
  --animation-speed: calc(300ms - ((var(--focus-level) - 5) * 30ms));
  --color-saturation: calc(100% - ((10 - var(--feeling-level)) * 8%));
  --decoration-opacity: calc(var(--feeling-level) * 0.1);
  
  /* Derived values for components */
  --shadow-light: 
    calc(var(--focus-level) * 0.6px)
    calc(var(--focus-level) * 0.6px)
    calc(var(--focus-level) * 1.2px)
    rgba(0,0,0,calc(0.08 * var(--shadow-strength))), 
    calc(var(--focus-level) * -0.6px)
    calc(var(--focus-level) * -0.6px)
    calc(var(--focus-level) * 1.2px)
    rgba(255,255,255,calc(0.95 * var(--shadow-strength)));
  
  /* Glass effect strength */
  --glass-blur: calc(var(--feeling-level) * 1.2px);
  --glass-opacity: calc(0.1 + (var(--feeling-level) * 0.01));
}

/* Evangelion Theme */
.theme-evangelion {
  --color-primary: #6B3E26; /* Eva-01 purple-green */
  --color-background: #1A1A1A; /* Dark background */
  --color-text: #F0F0F0; /* Light text */
  --color-accent: #EC5252; /* NERV red */
  --color-highlight: #FFC336; /* Warning yellow */
  --color-secondary: #3D7171; /* Terminal green */
  
  /* Adjusted shadow for dark theme */
  --shadow-light: 
    calc(var(--focus-level) * 0.6px)
    calc(var(--focus-level) * 0.6px)
    calc(var(--focus-level) * 1.2px)
    rgba(0,0,0,calc(0.3 * var(--shadow-strength))), 
    calc(var(--focus-level) * -0.6px)
    calc(var(--focus-level) * -0.6px)
    calc(var(--focus-level) * 1.2px)
    rgba(60,60,60,calc(0.7 * var(--shadow-strength)));
}
```

## 4. Theme Switching Implementation

### 4.1 Svelte Store for Theme State

```javascript
// src/lib/stores/themeStore.js
import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';

// Theme constants - now derived from focus/feeling values
export const THEME_THRESHOLDS = {
  FORESTRY: {
    focus: { min: 4, max: 6 },
    feeling: { min: 4, max: 6 }
  },
  EVANGELION: {
    focus: { min: 8, max: 10 },
    feeling: { min: 1, max: 3 }
  }
};

export const PRESETS = {
  MINIMALIST: { focus: 8, feeling: 2, name: 'Minimalist Wireframe' },
  BALANCED: { focus: 5, feeling: 5, name: 'Balanced Productivity' },
  CREATIVE: { focus: 3, feeling: 8, name: 'Creative Mapping' },
};

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
    if ($focusLevel >= THEME_THRESHOLDS.EVANGELION.focus.min && 
        $focusLevel <= THEME_THRESHOLDS.EVANGELION.focus.max &&
        $feelingLevel >= THEME_THRESHOLDS.EVANGELION.feeling.min && 
        $feelingLevel <= THEME_THRESHOLDS.EVANGELION.feeling.max) {
      return 'evangelion';
    }
    return 'forestry'; // Default theme
  }
);

// Apply theme changes when stores update
if (browser) {
  // Theme change handler
  currentTheme.subscribe(value => {
    // Remove all theme classes
    document.documentElement.classList.remove(
      ...Object.values(THEME_THRESHOLDS).map(theme => `theme-${theme}`)
    );
    
    // Add current theme class if not default
    if (value !== 'forestry') {
      document.documentElement.classList.add(`theme-${value}`);
    }
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
export function applyPreset(presetKey) {
  const preset = PRESETS[presetKey];
  if (preset) {
    focusLevel.set(preset.focus);
    feelingLevel.set(preset.feeling);
  }
}
```

### 4.2 Theme Switcher Component

```svelte
<!-- src/lib/components/ThemeSwitcher.svelte -->
<script>
  import { fly, fade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { 
    focusLevel, 
    feelingLevel, 
    PRESETS,
    applyPreset 
  } from '$lib/stores/themeStore';
  
  // Local state
  let showThemePanel = false;
</script>

<div class="fixed bottom-4 right-4 z-50">
  <!-- Theme toggle button -->
  <button 
    class="neumorph-panel-sm p-3 rounded-full"
    on:click={() => showThemePanel = !showThemePanel}
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  </button>
  
  <!-- Theme panel -->
  {#if showThemePanel}
    <div 
      class="glass-panel w-80 absolute bottom-16 right-0"
      transition:fly={{ y: 20, duration: 300, easing: cubicOut }}
    >
      <div class="p-4">
        <h3 class="text-lg font-medium mb-4">Theme Settings</h3>
        
        <!-- Focus control -->
        <div class="mb-4">
          <div class="flex justify-between mb-1">
            <label class="text-sm">Focus: {$focusLevel}</label>
            <span class="text-sm opacity-70">
              {$focusLevel <= 3 ? 'Relaxed' : $focusLevel >= 8 ? 'Intense' : 'Balanced'}
            </span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="10" 
            step="1"
            bind:value={$focusLevel}
            class="w-full"
          />
        </div>
        
        <!-- Feeling control -->
        <div class="mb-4">
          <div class="flex justify-between mb-1">
            <label class="text-sm">Feeling: {$feelingLevel}</label>
            <span class="text-sm opacity-70">
              {$feelingLevel <= 3 ? 'Utilitarian' : $feelingLevel >= 8 ? 'Playful' : 'Balanced'}
            </span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="10" 
            step="1"
            bind:value={$feelingLevel}
            class="w-full"
          />
        </div>
        
        <!-- Presets -->
        <div class="mt-6">
          <label class="block text-sm mb-2">Presets</label>
          <div class="grid grid-cols-3 gap-2">
            <button 
              class="p-2 text-xs rounded-lg neumorph-panel-sm hover:neumorph-pressed transition-all duration-200"
              on:click={() => applyPreset('MINIMALIST')}
            >
              Minimalist
            </button>
            <button 
              class="p-2 text-xs rounded-lg neumorph-panel-sm hover:neumorph-pressed transition-all duration-200"
              on:click={() => applyPreset('BALANCED')}
            >
              Balanced
            </button>
            <button 
              class="p-2 text-xs rounded-lg neumorph-panel-sm hover:neumorph-pressed transition-all duration-200"
              on:click={() => applyPreset('CREATIVE')}
            >
              Creative
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
```

### 4.3 Theme Transition Overlay

For smooth theme transitions, we can create an overlay component that handles the visual transition:

```svelte
<!-- src/lib/components/ThemeTransition.svelte -->
<script>
  import { themeName } from '$lib/stores/themeStore';
  import { fade } from 'svelte/transition';
  import { onMount } from 'svelte';
  
  let transitioning = false;
  let previousTheme = $themeName;
  
  // Watch for theme changes
  $: if ($themeName !== previousTheme && !transitioning) {
    startTransition();
    previousTheme = $themeName;
  }
  
  function startTransition() {
    transitioning = true;
    // Reset after animation completes
    setTimeout(() => {
      transitioning = false;
    }, 1000); // Match this to the CSS transition duration
  }
</script>

{#if transitioning}
  <div 
    class="fixed inset-0 z-[9999] pointer-events-none theme-transition-overlay"
    transition:fade={{ duration: 1000 }}
  ></div>
{/if}

<style>
  .theme-transition-overlay {
    background-color: var(--color-background);
    opacity: 0.5;
    animation: theme-transition 1s ease-in-out forwards;
  }
  
  @keyframes theme-transition {
    0% { opacity: 0; }
    50% { opacity: 1; }
    100% { opacity: 0; }
  }
</style>
```

## 5. Tailoring Components for Theme Responsiveness

To make your components responsive to theme changes, modify them to use CSS variables:

### 5.1 Button Component Example

```svelte
<!-- src/lib/components/ui/button/Button.svelte (modified) -->
<script lang="ts">
  import { cn } from "$lib/utils";
  import { Button as ButtonPrimitive } from "bits-ui";
  import type { ButtonProps } from "./types";
  
  type $$Props = ButtonProps;
  
  let className: $$Props["className"] = undefined;
  export { className as class };
  export let variant: $$Props["variant"] = "default";
  export let size: $$Props["size"] = "default";
  export let builders: $$Props["builders"] = [];
</script>

<ButtonPrimitive
  {builders}
  class={cn(
    // Base styles using CSS variables for theme-responsiveness
    "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--border-radius)] text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    
    // Variants using CSS variables
    {
      default:
        "bg-primary text-primary-foreground hover:bg-primary/90",
      destructive:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline:
        "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      // Neumorphic variants using shadow variables
      neumorph: "bg-[var(--color-background)] shadow-[var(--shadow-light)] hover:shadow-[var(--shadow-light)] hover:-translate-y-[calc(var(--focus-level)*0.05rem)] active:shadow-[var(--shadow-inner)] active:translate-y-0 transition-all duration-[var(--animation-speed)]",
      "neumorph-pressed": "bg-[var(--color-background)] shadow-[var(--shadow-inner)]",
    }[variant],
    
    // Sizes with responsive spacing
    {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    }[size],
    className
  )}
  {...$$restProps}
>
  <slot />
</ButtonPrimitive>
```

### 5.2 Card Component Example

```svelte
<!-- src/lib/components/ui/card/Card.svelte (modified) -->
<script lang="ts">
  import { cn } from "$lib/utils";
  import type { HTMLAttributes } from "svelte/elements";

  type $$Props = HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "glass" | "neumorph";
  };

  let className: $$Props["className"] = undefined;
  export let variant: $$Props["variant"] = "default";
  export { className as class };
</script>

<div
  class={cn(
    "rounded-[var(--border-radius)] border bg-card text-card-foreground shadow",
    {
      default: "border border-border",
      glass: "bg-[rgba(var(--color-background-rgb),var(--glass-opacity))] backdrop-blur-[var(--glass-blur)] border-white/20",
      neumorph: "border-0 bg-[var(--color-background)] shadow-[var(--shadow-light)]"
    }[variant],
    className
  )}
  {...$$restProps}
>
  <slot />
</div>
```

## 6. Integrating with App Layout

Add the theme components to your layout for site-wide availability:

```svelte
<!-- src/routes/+layout.svelte (modified) -->
<script lang="ts">
  import { invalidate } from '$app/navigation';
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import { user } from '$lib/stores/userStore';
  import { Button } from "$lib/components/ui/button";
  import { page } from '$app/stores';
  import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
  import ThemeTransition from '$lib/components/ThemeTransition.svelte';
  import "../app.css";
  import "$lib/styles/themes.css"; // Add this import

  export let data;
  
  // Rest of your layout code...
</script>

<svelte:head>
  <link rel="icon" href="/logo.jpg" type="image/jpeg">
</svelte:head>

<!-- Theme transition overlay -->
<ThemeTransition />

<div class="min-h-screen flex flex-col">
  <!-- Your existing layout content -->
  
  <!-- Theme switcher -->
  <ThemeSwitcher />
</div>
```

## 7. Creating the Evangelion Theme

For the Evangelion theme, we implement a comprehensive set of component-level changes that transform the UI to match the anime's aesthetic:

```css
/* src/lib/styles/themes.css */

/* Evangelion Theme */
.theme-evangelion {
  /* Base colors inspired by Evangelion anime */
  --color-primary: #6B3E26; /* Eva-01 purple-green */
  --color-background: #1A1A1A; /* Dark background */
  --color-background-rgb: 26, 26, 26;
  --color-text: #F0F0F0; /* Light text */
  --color-accent: #EC5252; /* NERV red */
  --color-highlight: #FFC336; /* Warning yellow */
  --color-secondary: #3D7171; /* Terminal green */
  
  /* Typography - Enhanced with monospace system */
  --font-mono: 'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace;
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-size-base: 16px;
  --line-height-base: 1.5;
  --letter-spacing-wide: 0.05em;
  
  /* Terminal-like text animation */
  --terminal-blink-color: rgba(236, 82, 82, 0.7);
  --terminal-blink-speed: 1s;
  
  /* Component-specific changes */
  --card-border: 1px solid rgba(236, 82, 82, 0.3);
  --card-header-bg: rgba(236, 82, 82, 0.15);
  --input-border: 1px solid rgba(236, 82, 82, 0.5);
  --button-border: 1px solid rgba(236, 82, 82, 0.7);
  
  /* Layout adjustments */
  --container-padding: 1.5rem;
  --grid-gap: 1.25rem;
  --section-spacing: 2rem;
  
  /* Animation timings */
  --transition-fast: 150ms;
  --transition-normal: 300ms;
  --transition-slow: 500ms;
  
  /* Special decorative elements */
  --eva-pattern: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff0000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

/* Terminal-like text animation */
@keyframes eva-terminal-blink {
  0%, 100% { border-color: var(--terminal-blink-color); }
  50% { border-color: transparent; }
}

.terminal-text {
  font-family: var(--font-mono);
  position: relative;
  display: inline-block;
}

.terminal-text::after {
  content: '';
  display: inline-block;
  width: 8px;
  height: 15px;
  background: var(--color-accent);
  margin-left: 3px;
  animation: eva-terminal-blink var(--terminal-blink-speed) infinite;
}

/* Component-specific styles */
.theme-evangelion .neumorph-panel-sm {
  border: var(--card-border);
  background: 
    linear-gradient(135deg, rgba(26,26,26,0.9), rgba(26,26,26,1)),
    var(--eva-pattern);
}

/* Typography adjustments */
.theme-evangelion h1, 
.theme-evangelion h2, 
.theme-evangelion h3,
.theme-evangelion .terminal-text {
  font-family: var(--font-mono);
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.theme-evangelion p,
.theme-evangelion .body-text {
  font-family: var(--font-sans);
  line-height: 1.6;
}

/* Card components */
.theme-evangelion .card {
  border: var(--card-border);
  background: rgba(26,26,26,0.8);
  backdrop-filter: blur(8px);
}

.theme-evangelion .card-header {
  background: var(--card-header-bg);
  border-bottom: var(--card-border);
  padding: 1rem;
}

/* Form elements */
.theme-evangelion input,
.theme-evangelion select,
.theme-evangelion textarea {
  border: var(--input-border);
  background: rgba(26,26,26,0.6);
  font-family: var(--font-mono);
  padding: 0.5rem;
}

.theme-evangelion input:focus,
.theme-evangelion select:focus,
.theme-evangelion textarea:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 2px rgba(236, 82, 82, 0.2);
}

/* Buttons */
.theme-evangelion .button {
  border: var(--button-border);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.theme-evangelion .button:hover {
  background: rgba(236, 82, 82, 0.1);
  border-color: var(--color-accent);
}

/* Navigation */
.theme-evangelion nav {
  border-bottom: var(--card-border);
}

.theme-evangelion .nav-link {
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Glass panels */
.theme-evangelion .glass-panel {
  background-color: rgba(26,26,26,0.7);
  border: var(--card-border);
  box-shadow: 0 0 15px rgba(236, 82, 82, 0.2);
}

/* Layout adjustments */
.theme-evangelion .container {
  padding: var(--container-padding);
}

.theme-evangelion .grid {
  gap: var(--grid-gap);
}

.theme-evangelion section {
  margin-bottom: var(--section-spacing);
}

/* Focus/Feeling adjustments */
.theme-evangelion[data-focus="high"] {
  --container-padding: 1rem;
  --grid-gap: 1rem;
  --section-spacing: 1.5rem;
}

.theme-evangelion[data-feeling="low"] {
  --eva-pattern: none;
  --card-border: 1px solid rgba(236, 82, 82, 0.2);
  --button-border: 1px solid rgba(236, 82, 82, 0.5);
}
```

### Component-Level Changes

The Evangelion theme implements significant changes at the component level:

1. **Typography System**:
   - Monospace fonts for headings and terminal-like text
   - Sans-serif for body text
   - Uppercase transformations for headings
   - Increased letter spacing for better readability
   - Terminal-like text animations with customizable timing

2. **Layout Adjustments**:
   - Reduced padding and spacing for high focus
   - Grid-based layouts with consistent gaps
   - Section spacing based on focus level
   - Container padding adjustments

3. **Form Elements**:
   - Terminal-like input styling
   - Monospace font for form controls
   - Red accent borders and focus states
   - Custom select and textarea styling

4. **Card Components**:
   - Semi-transparent backgrounds
   - Red accent borders
   - Pattern overlays (when feeling is high)
   - Custom header styling

5. **Navigation**:
   - Monospace font for links
   - Uppercase transformations
   - Red accent borders
   - Hover effects with red glow

6. **Buttons**:
   - Terminal-like appearance
   - Uppercase text
   - Red accent borders
   - Hover effects with red glow

7. **Glass Panels**:
   - Darker backgrounds
   - Red accent borders
   - Subtle red glow effects
   - Increased blur effect

8. **Focus/Feeling Adjustments**:
   - High focus: Reduced spacing, increased contrast
   - Low feeling: Removed patterns, simplified borders
   - High feeling: Added patterns, increased decorative elements

These component-level changes create a cohesive, terminal-like interface that maintains functionality while providing a distinct aesthetic experience.

## 8. Implementation Roadmap

### Phase 1: Foundation Setup
1. Create theme CSS file with variables structure
2. Implement theme store with focus/feeling controls
3. Set up theme thresholds for automatic theme switching
4. Implement theme persistence

### Phase 2: Component Adaptation
1. Update base components to use theme variables
2. Implement component-level changes for Evangelion theme
3. Add monospace font support and typography system
4. Create glass panel and neumorphic components

### Phase 3: Evangelion Theme Implementation
1. Create comprehensive Evangelion theme CSS
2. Implement terminal-like text animations
3. Add decorative patterns and borders
4. Test component-level changes across all routes

### Phase 4: Focus/Feeling Controls
1. Implement focus/feeling UI controls
2. Create derived variable calculations
3. Add preset configurations
4. Test automatic theme switching based on thresholds

### Phase 5: Polish & Testing
1. Optimize transitions and animations
2. Add theme preview functionality
3. Test across browsers
4. Performance optimization

### Phase 6: Documentation & Maintenance
1. Document component-level changes
2. Create theme customization guide
3. Add theme testing procedures
4. Set up theme maintenance workflow

## 9. Technical Considerations

### Browser Compatibility
- CSS Variables have good browser support (IE11 is the only major exception)
- Consider fallbacks for older browsers if needed
- Test monospace font fallbacks
- Ensure terminal animations work across browsers

### Performance
- For optimal performance, limit DOM updates during theme changes
- Use `requestAnimationFrame` for smoother transitions
- Consider debouncing slider inputs
- Optimize pattern rendering in Evangelion theme
- Use hardware-accelerated properties for terminal animations

### Accessibility
- Ensure sufficient contrast in all theme combinations
- Add proper ARIA labels to theme controls
- Test with screen readers
- Maintain readability with monospace fonts
- Consider reduced motion preferences for terminal animations

### Mobile Considerations
- Make theme controls touch-friendly
- Consider simplified theme interface for mobile
- Test performance on lower-end devices
- Optimize pattern rendering for mobile

## 10. Conclusion

This theming system implementation provides a flexible, user-controlled experience that balances technical performance with creative expression. The Focus/Feeling dimensions create a unique approach to theming that goes beyond simple color schemes, allowing users to adjust their interface according to their work style and preferences.

By using CSS variables with Svelte stores, we maintain excellent performance while providing dynamic customization. The addition of component-level changes in the Evangelion theme creates a distinct aesthetic experience that transforms the entire interface while maintaining functionality.

The automatic theme switching based on focus/feeling thresholds provides a seamless experience where the interface naturally evolves with the user's preferences, rather than requiring explicit theme selection. This approach creates a more intuitive and engaging user experience that adapts to the user's needs and preferences.

Implementation will proceed in phases, prioritizing foundational improvements before moving to more advanced features. Throughout this process, we will maintain a commitment to performance, accessibility, and user-centered design principles.

## Theme Switching Analysis and Implementation Recommendations

After implementing and testing the dynamic theming system, we've identified several issues causing glitchiness during theme transitions. This section documents the problems and recommends solutions to improve the system's stability and performance.

### Current Implementation Issues

1. **Store/CSS Separation Issue**:
   - Current implementation mixes state management with DOM manipulation
   - Store subscribers directly modify DOM elements and CSS variables
   - This causes race conditions during theme transitions

2. **Transition Timing Problems**:
   - Theme changes can overlap when switching rapidly
   - CSS transitions don't complete before new ones begin
   - Visual glitches occur during rapid theme switching

3. **Performance Considerations**:
   - Multiple separate DOM operations cause layout thrashing
   - Style recalculations happen too frequently
   - Theme feature flags set as data attributes create extra work

### Recommended Solutions

#### 1. Store Structure and Responsibility

**Issue**: The current `themeStore.ts` combines state management with DOM manipulation, which violates separation of concerns.

**Solution**:
- Refactor the store to focus solely on state management
- Move DOM manipulations to components or custom actions
- Use reactive bindings in Svelte components instead of direct DOM manipulation

**Implementation Example**:
```typescript
// Improved themeStore.ts structure
import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

// Store configuration and initialization (keep as is)
// ...

// Remove all direct DOM manipulations from subscribers
// Instead, export derived stores and actions

export const themeClass = derived(
  currentTheme,
  $theme => $theme !== THEMES.FORESTRY ? `theme-${$theme}` : ''
);

export const themeStyles = derived(
  [focusLevel, feelingLevel],
  ([$focus, $feeling]) => ({
    '--focus-level': $focus,
    '--feeling-level': $feeling
  })
);
```

#### 2. Theme Transition Management

**Issue**: The current transition implementation uses a simple boolean flag that doesn't guarantee synchronization with CSS transitions.

**Solution**:
- Implement a proper transition lock using promises
- Listen for CSS transition completion events
- Add a dedicated transition manager

**Implementation Example**:
```typescript
// In a new themeTransitionManager.ts
import { writable } from 'svelte/store';

export const isTransitioning = writable(false);

// Returns a promise that resolves when transition completes
export function transitionTheme(callback: () => void, duration = 300) {
  return new Promise<void>(resolve => {
    isTransitioning.set(true);
    
    // Execute the theme change
    callback();
    
    // Wait for transition to complete
    setTimeout(() => {
      isTransitioning.set(false);
      resolve();
    }, duration);
  });
}
```

#### 3. CSS Architecture Improvements

**Issue**: All theme definitions are in a single CSS file, making maintenance difficult.

**Solution**:
- Modularize theme CSS files
- Create a base theme with core variables
- Create theme-specific override files
- Use CSS imports to organize the files

**Implementation Example**:
```css
/* src/lib/styles/themes/base.css */
:root {
  /* Base theme variables shared across all themes */
  /* ... */
}

/* src/lib/styles/themes/evangelion.css */
.theme-evangelion {
  /* Evangelion-specific overrides */
  /* ... */
}

/* src/lib/styles/themes/forestry.css */
/* No class needed for default theme */
/* ... */

/* src/lib/styles/themes.css - Main import file */
@import './themes/base.css';
@import './themes/evangelion.css';
@import './themes/forestry.css';
```

#### 4. Performance Optimizations

**Issue**: Multiple separate DOM updates cause layout thrashing and unnecessary repaints.

**Solution**:
- Batch DOM updates
- Use CSS variables for dynamic properties
- Leverage Svelte's reactivity for efficient updates

**Implementation Example**:
```svelte
<!-- ThemeProvider.svelte -->
<script>
  import { currentTheme, focusLevel, feelingLevel, themeFeatures } from '$lib/stores/themeStore';
  import { onMount, onDestroy } from 'svelte';
  
  // Batch updates in a single operation
  $: themeProps = {
    '--focus-level': $focusLevel,
    '--feeling-level': $feelingLevel,
  };
  
  $: themeClass = $currentTheme !== 'forestry' ? `theme-${$currentTheme}` : '';
  
  // Apply theme changes once, efficiently
  onMount(() => {
    // Initial setup if needed
  });
  
  onDestroy(() => {
    // Cleanup if needed
  });
</script>

<div 
  class={themeClass}
  style={Object.entries(themeProps).map(([k, v]) => `${k}:${v}`).join(';')}
  {...Object.entries($themeFeatures).reduce((acc, [key, value]) => {
    acc[`data-${key}`] = value.toString();
    return acc;
  }, {})}
>
  <slot />
</div>
```

#### 5. Theme Debugging Tools

**Issue**: Difficult to troubleshoot theme transition issues.

**Solution**:
- Add a debug panel to visualize current theme state
- Log theme transitions for troubleshooting
- Provide visual indicators during transitions

**Implementation Example**:
```svelte
<!-- ThemeDebugPanel.svelte -->
<script>
  import { currentTheme, focusLevel, feelingLevel, themeFeatures } from '$lib/stores/themeStore';
  import { isTransitioning } from '$lib/utils/themeTransitionManager';
  
  let show = false;
</script>

{#if show}
  <div class="theme-debug">
    <p>Theme: {$currentTheme}</p>
    <p>Focus: {$focusLevel}</p>
    <p>Feeling: {$feelingLevel}</p>
    <p>Transitioning: {$isTransitioning ? 'Yes' : 'No'}</p>
    <p>Features: {JSON.stringify($themeFeatures)}</p>
  </div>
{/if}

<button class="theme-debug-toggle" on:click={() => show = !show}>
  Debug
</button>
```

### Theme Debugging CSS

Add these utility classes to help troubleshoot theme issues:

```css
.theme-debug {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(0,0,0,0.8);
  color: white;
  padding: 10px;
  border-radius: 4px;
  font-family: monospace;
  z-index: 9999;
}

.theme-debug-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: var(--color-secondary);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
  z-index: 10000;
}
```

## Implementation Plan for Next Developer

1. **Refactor Store Structure**:
   - Separate state management from DOM manipulation in `themeStore.ts`
   - Create a clean API for theme management
   - Ensure store only manages state, not DOM updates

2. **Improve Theme Transitions**:
   - Create `themeTransitionManager.ts` with the transition logic
   - Update `ThemeTransition.svelte` to use the manager
   - Ensure transitions complete before new ones begin

3. **Reorganize CSS Files**:
   - Split `themes.css` into modular files under `src/lib/styles/themes/`
   - Create clear separation between base variables and theme overrides
   - Ensure variables follow a consistent naming convention

4. **Add Debug Tooling**:
   - Create a new `ThemeDebugPanel.svelte` component
   - Add it to the theme test page for development
   - Include console logging of theme state changes

5. **Optimize Performance**:
   - Refactor theme application to minimize DOM operations
   - Create a `ThemeProvider.svelte` component to handle all theme logic
   - Update `+layout.svelte` to use the provider

This structured approach will resolve the current issues with theme switching while maintaining the flexibility of the dynamic theming system. The focus/feeling concept should remain intact, but with a more robust implementation that avoids race conditions and performance bottlenecks.

## Common Theme Issues and Solutions

### Issue: Theme Changes Flicker or Show Multiple Themes
**Cause**: Race conditions in DOM updates
**Solution**: Use the transition manager to prevent overlapping changes and ensure clean transitions.

### Issue: Theme Features Inconsistent After Transition
**Cause**: Feature flags not updating with theme
**Solution**: Move feature flag management to the ThemeProvider component to ensure synchronized updates.

### Issue: Poor Performance with Theme Sliders
**Cause**: Too many style recalculations during slider movement
**Solution**: Debounce slider input and batch style updates to reduce calculations.

```typescript
// Example debounce implementation
function debounce(func: Function, wait: number) {
  let timeout: number;
  return function(...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Use in ThemeSwitcher.svelte
const debouncedFocusUpdate = debounce((value) => {
  focusLevel.set(value);
}, 100);

// Then use in input event
<input 
  type="range" 
  on:input={(e) => debouncedFocusUpdate(e.target.value)} 
/>
```

### Issue: Transitions Not Completing
**Cause**: New transitions starting before old ones complete
**Solution**: Queue transitions and only start new ones when previous ones finish.

```typescript
// Example transition queue
let transitionQueue: (() => Promise<void>)[] = [];
let isProcessingQueue = false;

async function queueTransition(transition: () => Promise<void>) {
  transitionQueue.push(transition);
  
  if (!isProcessingQueue) {
    isProcessingQueue = true;
    
    while (transitionQueue.length > 0) {
      const nextTransition = transitionQueue.shift();
      if (nextTransition) {
        await nextTransition();
      }
    }
    
    isProcessingQueue = false;
  }
}
```

### Issue: Memory Leaks with Theme Listeners
**Cause**: Event listeners not being cleaned up properly
**Solution**: Use Svelte's lifecycle hooks properly.

```svelte
<script>
  import { onMount, onDestroy } from 'svelte';
  import { currentTheme } from '$lib/stores/themeStore';
  
  let unsubscribe: () => void;
  
  onMount(() => {
    unsubscribe = currentTheme.subscribe((theme) => {
      // Theme change logic
    });
  });
  
  onDestroy(() => {
    if (unsubscribe) {
      unsubscribe();
    }
  });
</script>
```

## Future Enhancements

Once the current issues are resolved, consider these enhancements:

1. **Theme Preview Mode**: Allow users to preview themes before applying them
2. **User Theme Customization**: Let users create and save custom themes
3. **Context-Aware Themes**: Automatically adjust themes based on time of day or user activity
4. **Theme Transitions API**: Allow developers to define custom transition effects between themes
5. **Accessibility Improvements**: Add high contrast and reduced motion theme variants 

## Conclusion

The dynamic theming system has a strong foundation but requires these refinements to achieve optimal performance and stability. By implementing the recommendations above, the next developer should be able to resolve the current issues and create a smooth, reliable theming experience.

The separation of concerns between state management and DOM manipulation is particularly important, as it will make the system more maintainable and less prone to race conditions. Combining this with proper transition management will eliminate most of the glitches currently observed.

These improvements will ensure that the innovative focus/feeling approach to theming can be fully realized without technical limitations undermining the user experience.
