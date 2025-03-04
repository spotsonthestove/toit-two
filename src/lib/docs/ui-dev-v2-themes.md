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

## 2. Technical Implementation Approaches

### 2.1 CSS Variables + Svelte Stores Approach

**Pros:**
- Native CSS support
- Excellent performance
- Simple implementation
- Works well with Tailwind

**Cons:**
- Limited to CSS properties
- Requires careful organization

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

### 2.2 TailwindCSS Theme Extension Approach

**Pros:**
- Integrates with your existing Tailwind setup
- Optimized CSS output
- Consistent with Tailwind's utility-first approach

**Cons:**
- Less dynamic than CSS variables
- Requires more build-time configuration
- More challenging for truly dynamic values

**Implementation:**
```javascript
// tailwind.config.js
import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      // Base theme colors remain the same
      colors: {
        'shadow-moss': '#2C3830',
        'speed-of-light': '#F6F4EF',
        // etc.
      },
      // Theme variants can be configured as variants
      boxShadow: {
        // Focus level 1 (minimal)
        'focus-1-neumorph': '2px 2px 4px rgba(0,0,0,0.05), -2px -2px 4px rgba(255,255,255,0.8)',
        // Focus level 5 (balanced)
        'focus-5-neumorph': '6px 6px 12px rgba(0,0,0,0.08), -6px -6px 12px rgba(255,255,255,0.95)',
        // Focus level 10 (maximum)
        'focus-10-neumorph': '10px 10px 20px rgba(0,0,0,0.12), -10px -10px 20px rgba(255,255,255,1)',
        // etc.
      },
    },
  },
  plugins: [],
}
```

With this approach, you would create CSS classes for each theme variation and toggle them with JS.

### 2.3 CSS-in-JS with Svelte

**Pros:**
- Full programmatic control over styles
- Can calculate complex relationships
- Cleaner component code

**Cons:**
- Additional dependency
- Potential performance considerations
- Diverges from Tailwind approach

**Implementation Example:**
```javascript
// Would require adding a library like svelte-styled-components
import styled from 'svelte-styled-components';

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: ${props => Math.max(0.25, 0.5 - (props.focusLevel * 0.03))}rem;
  box-shadow: ${props => `
    ${props.focusLevel * 0.6}px ${props.focusLevel * 0.6}px ${props.focusLevel * 1.2}px rgba(0,0,0,0.08),
    -${props.focusLevel * 0.6}px -${props.focusLevel * 0.6}px ${props.focusLevel * 1.2}px rgba(255,255,255,0.95)
  `};
  background-color: var(--speed-of-light);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-${props => props.focusLevel * 0.1}px);
  }
`;
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
import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

// Theme constants
export const THEMES = {
  FORESTRY: 'forestry',
  EVANGELION: 'evangelion',
  // Add more themes as needed
};

export const PRESETS = {
  MINIMALIST: { focus: 8, feeling: 2, name: 'Minimalist Wireframe' },
  BALANCED: { focus: 5, feeling: 5, name: 'Balanced Productivity' },
  CREATIVE: { focus: 3, feeling: 8, name: 'Creative Mapping' },
};

// Initialize from localStorage if available
const initialTheme = browser ? 
  localStorage.getItem('theme-name') || THEMES.FORESTRY : THEMES.FORESTRY;
const initialFocus = browser ? 
  parseInt(localStorage.getItem('theme-focus') || '5') : 5;
const initialFeeling = browser ? 
  parseInt(localStorage.getItem('theme-feeling') || '5') : 5;

// Create stores
export const themeName = writable(initialTheme);
export const focusLevel = writable(initialFocus);
export const feelingLevel = writable(initialFeeling);

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
    
    document.documentElement.style.setProperty('--focus-level', focus);
    document.documentElement.style.setProperty('--feeling-level', feeling);
    
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
    themeName, 
    focusLevel, 
    feelingLevel, 
    THEMES, 
    PRESETS,
    applyPreset 
  } from '$lib/stores/themeStore';
  
  // Local state
  let showThemePanel = false;
  
  // Handle theme change with animation
  function changeTheme(newTheme) {
    // Use a transition delay to allow for animation
    setTimeout(() => {
      themeName.set(newTheme);
    }, 300);
  }
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
        
        <!-- Theme selector -->
        <div class="mb-6">
          <label class="block text-sm mb-2">Theme</label>
          <div class="flex gap-2">
            <button 
              class="flex-1 p-3 rounded-lg transition-all duration-300 {$themeName === THEMES.FORESTRY ? 'neumorph-pressed' : 'neumorph-panel-sm'}"
              on:click={() => changeTheme(THEMES.FORESTRY)}
            >
              Forestry
            </button>
            <button 
              class="flex-1 p-3 rounded-lg transition-all duration-300 {$themeName === THEMES.EVANGELION ? 'neumorph-pressed' : 'neumorph-panel-sm'}"
              on:click={() => changeTheme(THEMES.EVANGELION)}
            >
              Evangelion
            </button>
          </div>
        </div>
        
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

For the Evangelion theme, create specialized CSS that captures the anime's aesthetic:

```css
/* src/lib/styles/themes.css (additional content) */

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
  
  /* Adjusted shadows for dark theme */
  --shadow-light: 
    calc(var(--focus-level) * 0.6px)
    calc(var(--focus-level) * 0.6px)
    calc(var(--focus-level) * 1.5px)
    rgba(0,0,0,0.5), 
    calc(var(--focus-level) * -0.6px)
    calc(var(--focus-level) * -0.6px)
    calc(var(--focus-level) * 1.5px)
    rgba(60,60,60,0.2);
  
  --shadow-inner: 
    inset calc(var(--focus-level) * 0.2px)
    calc(var(--focus-level) * 0.2px)
    calc(var(--focus-level) * 0.5px)
    rgba(0,0,0,0.6), 
    inset calc(var(--focus-level) * -0.2px)
    calc(var(--focus-level) * -0.2px)
    calc(var(--focus-level) * 0.5px)
    rgba(60,60,60,0.3);
  
  /* Special Evangelion-specific decorative elements */
  --eva-pattern: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff0000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  
  /* Special card styles */
  --card-border: 1px solid rgba(236, 82, 82, 0.3);
  --card-header-bg: rgba(236, 82, 82, 0.15);
  
  /* Font adjustments */
  --font-mono: 'Courier New', monospace;
  
  /* Tailwind theme overrides */
  --background: 0 0% 10%;
  --foreground: 0 0% 94%;
  --card: 0 0% 12%;
  --card-foreground: 0 0% 94%;
  --popover: 0 0% 12%;
  --popover-foreground: 0 0% 94%;
  --primary: 0 73% 57%;
  --primary-foreground: 0 0% 100%;
  --secondary: 187 73% 32%;
  --secondary-foreground: 0 0% 100%;
  --muted: 0 0% 15%;
  --muted-foreground: 0 0% 66%;
  --accent: 0 0% 15%;
  --accent-foreground: 0 0% 94%;
  --destructive: 0 62% 30%;
  --destructive-foreground: 0 0% 94%;
  --border: 0 0% 15%;
  --input: 0 0% 15%;
  --ring: 0 73% 57%;
}

/* Evangelion-specific component styles */
.theme-evangelion .neumorph-panel,
.theme-evangelion .neumorph-panel-sm {
  border: 1px solid rgba(236, 82, 82, 0.2);
  background: 
    linear-gradient(135deg, rgba(26,26,26,0.9), rgba(26,26,26,1)),
    var(--eva-pattern);
}

.theme-evangelion h1, 
.theme-evangelion h2, 
.theme-evangelion h3 {
  font-family: var(--font-mono);
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.theme-evangelion .glass-panel {
  background-color: rgba(26,26,26,0.7);
  border: var(--card-border);
  box-shadow: 0 0 15px rgba(236, 82, 82, 0.2);
}

.theme-evangelion input[type="range"] {
  accent-color: #EC5252;
}

/* Terminal-like text animation for Evangelion theme */
@keyframes eva-terminal-blink {
  0%, 100% { border-color: rgba(236, 82, 82, 0.7); }
  50% { border-color: transparent; }
}

.theme-evangelion .terminal-text::after {
  content: '';
  display: inline-block;
  width: 8px;
  height: 15px;
  background: #EC5252;
  margin-left: 3px;
  animation: eva-terminal-blink 1s infinite;
}
```

## 8. Implementation Roadmap

### Phase 1: Foundation Setup
1. Create theme CSS file with variables structure
2. Implement theme store with focus/feeling controls
3. Create basic theme switching functionality
4. Implement theme persistence

### Phase 2: Component Adaptation
1. Update Button components to use theme variables
2. Update Card and form components
3. Modify layout components
4. Create ThemeSwitcher UI component

### Phase 3: Evangelion Theme Implementation
1. Create Evangelion theme CSS
2. Add special Evangelion-specific component styles
3. Test theme switching
4. Implement transition animations

### Phase 4: Focus/Feeling Controls
1. Implement focus/feeling UI controls
2. Create derived variable calculations
3. Add preset configurations
4. Test full range of themes

### Phase 5: Polish & Testing
1. Optimize transitions and animations
2. Add theme preview functionality
3. Test across browsers
4. Performance optimization

## 9. Technical Considerations

### Browser Compatibility
- CSS Variables have good browser support (IE11 is the only major exception)
- Consider fallbacks for older browsers if needed

### Performance
- For optimal performance, limit DOM updates during theme changes
- Use `requestAnimationFrame` for smoother transitions
- Consider debouncing slider inputs

### Accessibility
- Ensure sufficient contrast in all theme combinations
- Add proper ARIA labels to theme controls
- Test with screen readers

### Mobile Considerations
- Make theme controls touch-friendly
- Consider simplified theme interface for mobile
- Test performance on lower-end devices

## 10. Conclusion

This theming system implementation provides a flexible, user-controlled experience that balances technical performance with creative expression. The Focus/Feeling dimensions create a unique approach to theming that goes beyond simple color schemes, allowing users to adjust their interface according to their work style and preferences.

By using CSS variables with Svelte stores, we maintain excellent performance while providing dynamic customization. The addition of smooth transitions and preset themes enhances the user experience and showcases the application's sophisticated UI capabilities.
