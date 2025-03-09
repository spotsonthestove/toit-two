# UI Development v2

This document outlines the next phase of UI development for our application, building upon the foundations established in UI Dev v1 and incorporating insights from our development journey documented in the Dev Journal.

## 1. Design System Refinements

### 1.1 Visual Style Adjustments

#### Neumorphism Enhancements ✅ IMPLEMENTED
- **Increased Contrast**: Enhance shadow contrast for better visibility and depth perception
- **Refined Shadow Values**:
  ```css
  /* Updated Shadow Values */
  --shadow-light: 6px 6px 12px rgba(0,0,0,0.08), -6px -6px 12px rgba(255,255,255,0.95);
  --shadow-medium: 4px 4px 8px rgba(0,0,0,0.08), -4px -4px 8px rgba(255,255,255,0.95);
  --shadow-inner: inset 2px 2px 5px rgba(0,0,0,0.05), inset -2px -2px 5px rgba(255,255,255,0.8);
  ```
- **Component-Specific Adjustments**:
  - Buttons: Deeper shadows on hover for more tactile feedback
  - Cards: Stronger edge definition with slightly higher contrast
  - Input fields: More pronounced inner shadow for better visual hierarchy

> **Implementation Notes**: Shadow values have been implemented in app.css and applied across components. Button hover states now include deeper shadows and subtle translations for tactile feedback.

#### Glassmorphism Improvements ✅ IMPLEMENTED
- **Enhanced Transparency Effects**:
  - Increase backdrop-filter blur values (8px to 12px)
  - Add subtle gradient overlays for depth
  - Implement more pronounced border highlights
- **Implementation Focus**:
  - Mind Maps route: Apply comprehensive glassmorphism styling
  - Modals: Enhance glass effect for all modal components
  - Node editing interfaces: Emphasize AR-like appearance
- **Updated CSS Values**:
  ```css
  /* Enhanced Glassmorphism */
  --glass-background: rgba(255, 255, 255, 0.15);
  --glass-border: 1px solid rgba(255, 255, 255, 0.2);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  --glass-blur: 12px;
  ```

> **Implementation Notes**: Glass panels have been implemented throughout the application, particularly in form components and modal dialogs. The beta-map page now uses a glass panel for its main content area.

### 1.2 Component Standardization ✅ IMPLEMENTED

- **Button Hierarchy**:
  - Primary: Neumorphic with accent color
  - Secondary: Subtle neumorphic with neutral color
  - Ghost: Text-only with hover effect
  - Icon: Circular neumorphic with centered icon

- **Card Components**:
  - Standard Card: Consistent padding, shadow, and corner radius
  - Interactive Card: Hover and active states with feedback
  - Glass Card: Semi-transparent with blur effect

- **Form Elements**:
  - Input fields: Consistent inner shadow and focus states
  - Dropdowns: Matching style with subtle indicators
  - Checkboxes/Radio buttons: Custom neumorphic styling

> **Implementation Notes**: Button hierarchy has been standardized across the application with consistent classes. Card components now follow the design system with proper hover states and transitions.

## 2. Navigation & Layout Improvements

### 2.1 Navigation Consolidation

- **Single Navigation Pattern**:
  - Eliminate duplicate navigation bars
  - Implement consistent top navigation across all routes
  - Add context-aware breadcrumbs for nested routes

- **Navigation Structure**:
  ```
  Header
  ├── Logo (centered on landing, left-aligned elsewhere)
  ├── Primary Navigation
  │   ├── Beta App
  │   ├── Mind Maps
  │   └── Toit Sessions
  └── User Menu
      ├── Profile
      ├── Settings
      └── Logout
  ```

- **Mobile Considerations**:
  - Collapsible menu for smaller screens
  - Bottom navigation option for mobile
  - Gesture support for common actions

### 2.2 Layout Consistency

### 2.1 Responsive Layout Enhancements ✅ IMPLEMENTED

- **Grid System**:
  - Implement consistent spacing and alignment
  - Use CSS Grid for complex layouts
  - Maintain responsive behavior across breakpoints

- **Content Containers**:
  - Standard max-width and padding for content areas
  - Consistent vertical rhythm with standardized spacing
  - Clear visual hierarchy with proper heading styles

- **Page Templates**:
  - List View: For task and session listings
  - Detail View: For individual item focus
  - Split View: For side-by-side comparisons or editing
  - Full Canvas: For mind map visualization

> **Implementation Notes**: Responsive layouts have been implemented across the application. The beta-app page uses a grid system for mind map cards, and the toit page uses a split view for sessions and visualization.

## 3. Route-Specific Enhancements

### 3.1 Landing Page Improvements ⏳ IN PROGRESS

- **Logo Animation**:
  - Centered, prominent logo with subtle entrance animation
  - Implement SVG animation for logo elements
  - Add micro-interactions on hover

- **Tagline Animation**:
  - Animate text transition from "You'll get around to it, when you can" to highlight "a round toit"
  - Use text morphing or sequential reveal techniques
  - Synchronize with logo animation for cohesive effect

- **Visual Hierarchy**:
  - Clear call-to-action for Beta App access
  - Simplified navigation focusing on core actions
  - Engaging but unobtrusive background elements

> **Implementation Notes**: Basic landing page structure is in place, but animations are still in progress. The navigation has been simplified with a focus on core actions.

### 3.2 Mind Maps Route Redesign ✅ IMPLEMENTED

- **Complete Styling Overhaul**:
  - Apply consistent neumorphic styling to all elements
  - Enhance card interactions with hover and active states
  - Implement glass panels for editing interfaces
  - Add subtle animations for state changes

> **Implementation Notes**: The beta-app and beta-map pages have been completely restyled with the new design system. Animations and transitions have been added for improved user experience.

### 3.3 Beta App Integration

- **Task-to-Mind Map Flow**:
  - Seamless loading of mind maps from task list
  - Clear visual connection between tasks and maps
  - Consistent styling across the flow

- **Data Synchronization**:
  - Real-time updates between task list and mind map
  - Progress indicators for AI processing
  - Proper error handling and recovery

- **User Experience**:
  - Intuitive navigation between views
  - Contextual help and guidance
  - Smooth transitions and animations

### 3.4 Toit Interface Refinements

- **ToitTorus Enhancements**:
  - Improved progress visualization around segments
  - Clearer task status indicators
  - Enhanced interaction for status toggling

- **Task Segment Improvements**:
  - Better labeling for task segments
  - More intuitive size representation
  - Enhanced hover and selection states

- **Progress Visualization**:
  - Animated progress indicators
  - Clearer completion metrics
  - Celebration animations for completed sessions

### 3.5 Design System Showcase Page ✅ IMPLEMENTED

- **Interactive Component Gallery**:
  - Showcase all UI components with interactive examples
  - Provide code snippets for implementation
  - Demonstrate variations and states

- **Color Palette Visualization**:
  - Display primary and secondary color schemes
  - Show accessibility contrast ratios
  - Provide context-specific usage examples

- **Typography Showcase**:
  - Display heading hierarchy with proper spacing
  - Show paragraph styles and text treatments
  - Demonstrate specialized text components

> **Implementation Notes**: A comprehensive design system showcase page has been created at `/design`. It includes interactive demos of neumorphic and glassmorphic components, color palette visualization, typography examples, and animation demonstrations.

## 4. Theming System Implementation

### 4.1 Theme Architecture

- **Theme Variables Structure**:
  ```css
  :root {
    /* Base Colors */
    --color-primary: #4361ee;
    --color-secondary: #3f37c9;
    --color-accent: #f72585;
    --color-background: #f8f9fa;
    --color-surface: #ffffff;
    --color-text: #333333;
    
    /* Focus/Feeling Variables */
    --focus-level: 5; /* 1-10 scale */
    --feeling-level: 5; /* 1-10 scale */
    
    /* Derived Variables (calculated based on focus/feeling) */
    --shadow-strength: calc(var(--focus-level) * 0.01);
    --color-saturation: calc(var(--feeling-level) * 10%);
    /* etc. */
  }
  ```

- **Theme Switching Mechanism**:
  - CSS custom properties for dynamic updates
  - JavaScript handlers for theme state management
  - LocalStorage persistence for user preferences

### 4.2 Focus & Feeling Controls

- **Focus Dimension (1-10)**:
  - Low: Relaxed, spacious layouts with softer contrasts
  - High: Dense, information-rich layouts with strong contrasts
  - Affects: Typography weight, information density, animation speed, contrast levels

- **Feeling Dimension (1-10)**:
  - Low: Monochromatic, wireframe-like, utilitarian
  - High: Colorful, organic shapes, playful elements
  - Affects: Color saturation, shape organicity, decoration elements, background patterns

- **UI Control Implementation**:
  - Dual slider interface for independent adjustment
  - Visual preview of changes
  - Preset combinations for common preferences

### 4.3 Theme Presets

- **Minimalist Wireframe**:
  - Focus: 8-10
  - Feeling: 1-3
  - Characteristics: Monospace fonts, high contrast, grid-based layouts, minimal decoration

- **Balanced Productivity**:
  - Focus: 5-7
  - Feeling: 4-6
  - Characteristics: Clean sans-serif, moderate contrast, balanced layouts

- **Creative Mapping**:
  - Focus: 3-5
  - Feeling: 7-10
  - Characteristics: Playful typography, organic shapes, rich colors, animated elements

## 5. Implementation Roadmap

### Phase 1: Foundation Refinements
1. Standardize design tokens and CSS variables
2. Consolidate navigation patterns
3. Fix duplicate navigation issues
4. Implement consistent layout templates

### Phase 2: Route-Specific Updates
1. Redesign Mind Maps route with proper styling
2. Enhance Beta App integration with mind maps
3. Improve ToitTorus visualization
4. Update landing page with animations

### Phase 3: Theming System
1. Implement theme architecture and variables
2. Create focus/feeling control interface
3. Develop theme presets
4. Add theme persistence and user preferences

### Phase 4: Polish & Optimization
1. Add micro-interactions and animations
2. Optimize performance for complex visualizations
3. Enhance accessibility features
4. Conduct comprehensive testing

## 6. Technical Considerations

### Component Architecture
- Use Svelte stores for theme state management
- Implement CSS custom properties for dynamic theming
- Create reusable components for common UI patterns

### Animation Strategy
- Use CSS transitions for simple state changes
- Leverage Svelte transitions for element entrances/exits
- Consider GSAP for complex sequences (logo animation)

### Performance Optimization
- Lazy load non-critical components
- Optimize Three.js rendering for mind maps
- Use efficient CSS selectors and properties

### Accessibility
- Maintain proper contrast ratios across themes
- Ensure keyboard navigation for all interactive elements
- Provide alternative text for visual elements

## 7. Summary

UI Development v2 builds upon our initial implementation with a focus on cohesive styling, improved user experience, and the introduction of a flexible theming system. By addressing the identified issues with navigation, styling consistency, and specific route enhancements, we aim to create a more polished and intuitive interface.

The introduction of the focus/feeling theming system provides users with personalized control over their experience, allowing them to tailor the interface to their preferences and work style. This approach balances the need for productivity-focused interfaces with the engaging, visual nature of mind mapping.

Implementation will proceed in phases, prioritizing foundational improvements before moving to more advanced features. Throughout this process, we will maintain a commitment to performance, accessibility, and user-centered design principles.

## 8. SvelteKit Route Architecture Recommendations

To improve the organization, maintainability, and user experience of our application, we should implement the following SvelteKit-specific architectural patterns:

### 8.1 Page Data Loading Pattern

Instead of loading data in component onMount functions, we should leverage SvelteKit's built-in data loading mechanism:

```typescript
// src/routes/beta-map/+page.ts
export const load = async ({ params, url, fetch }) => {
  const mindMapId = url.searchParams.get('id');
  if (!mindMapId) return { redirect: '/beta-app' };
  
  try {
    const response = await fetch(`/api/mindmaps/${mindMapId}`);
    const mindMap = await response.json();
    return { mindMap };
  } catch (error) {
    return { error: 'Failed to load mind map' };
  }
};
```

Benefits:
- Data is loaded before component rendering
- Automatic loading states with minimal boilerplate
- Cleaner component code with data already available
- Better error handling through SvelteKit's error boundaries

### 8.2 API Endpoint Architecture

Create dedicated API endpoints for data operations to support both web and potential mobile clients:

```typescript
// src/routes/api/mindmaps/[id]/+server.ts
import { json } from '@sveltejs/kit';
import { getMindMapById } from '$lib/supabaseClient';

export async function GET({ params, locals }) {
  const session = await locals.getSession();
  if (!session) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const mindMap = await getMindMapById(parseInt(params.id));
    return json(mindMap);
  } catch (error) {
    return json({ error: 'Failed to load mind map' }, { status: 500 });
  }
}
```

Benefits:
- Clear separation between data and presentation
- Reusable endpoints for multiple clients (web, mobile)
- Consistent error handling and response format
- Better testability of data operations

### 8.3 Layout-Based Navigation

Implement shared layouts for related routes to maintain consistent navigation:

```svelte
<!-- src/routes/beta/(app)/+layout.svelte -->
<script>
  import { page } from '$app/stores';
  import { Button } from "$lib/components/ui/button";
</script>

<div class="min-h-screen bg-speed-of-light">
  <header class="container mx-auto px-4 py-4">
    <nav class="flex justify-between items-center">
      <h1 class="text-xl font-bold">Mind Map Beta</h1>
      <div class="flex gap-4">
        <Button variant="ghost" href="/beta/app">Maps List</Button>
        <!-- Other navigation items -->
      </div>
    </nav>
  </header>
  
  <main class="container mx-auto px-4 py-8">
    <slot />
  </main>
</div>
```

Route organization:
- `/src/routes/beta/(app)/+page.svelte` (redirect to beta-app)
- `/src/routes/beta/(app)/app/+page.svelte` (beta-app)
- `/src/routes/beta/(app)/map/[id]/+page.svelte` (beta-map)

Benefits:
- Consistent navigation across related routes
- Reduced code duplication
- Clearer route organization
- Better user experience with persistent UI elements

### 8.4 Route Parameters vs. Query Parameters

Use route parameters for resource identifiers instead of query parameters:

```
/beta/map/123 instead of /beta-map?id=123
```

Implementation:
```typescript
// src/routes/beta/(app)/map/[id]/+page.ts
export const load = async ({ params, fetch }) => {
  const mindMapId = params.id;
  // Load data using mindMapId
};
```

Benefits:
- More RESTful URL structure
- Better compatibility with SvelteKit's routing system
- Clearer indication of resource hierarchy
- Improved SEO and shareability of URLs

### 8.5 Error Handling and Boundaries

Implement proper error boundaries using SvelteKit's error handling:

```svelte
<!-- src/routes/beta/(app)/map/[id]/+error.svelte -->
<script>
  import { page } from '$app/stores';
  import { Button } from "$lib/components/ui/button";
</script>

<div class="flex justify-center items-center h-[60vh]">
  <div class="neumorph-panel p-8 text-center">
    <h2 class="text-xl font-semibold mb-4">Error Loading Mind Map</h2>
    <p class="text-red-500">{$page.error.message}</p>
    <Button class="mt-4" href="/beta/app">Return to Mind Maps</Button>
  </div>
</div>
```

Benefits:
- Graceful error handling
- Consistent error presentation
- Better user experience during failures
- Cleaner component code without error handling logic

These architectural patterns should be implemented across the application to improve code organization, maintainability, and user experience while leveraging SvelteKit's powerful features.

## 9. Theme-Driven Component Architecture

To create a more adaptable UI that responds to theme changes, focus levels, and feeling levels, we need a component architecture that's both reusable and highly customizable. This section outlines our approach to building theme-driven components.

### 9.1 Component Adaptation Strategy

Our components need to adapt to multiple dimensions of customization:

1. **Theme Identity**: Visual style specific to themes like Evangelion or Forestry
2. **Focus Level**: Information density and UI complexity (1-10 scale)
3. **Feeling Level**: Visual richness and playfulness (1-10 scale)

To achieve this, we'll implement a layered approach:

```
Base Component Layer
↓
Theme-Specific Styling Layer
↓
Focus/Feeling Adjustments Layer
↓
Instance-Specific Customizations
```

### 9.2 Implementation Approaches

#### Option 1: Enhanced Shadcn/Svelte (Recommended)

We can continue using Shadcn/Svelte components but enhance them with theme-aware wrappers:

```svelte
<!-- Enhanced Button Component -->
<script lang="ts">
  import { Button as ShadcnButton } from "$lib/components/ui/button";
  import { currentTheme, focusLevel, feelingLevel } from '$lib/stores/themeStore';
  
  export let variant = "default";
  export let size = "default";
  export let {...props} = {};
  
  // Derive theme-specific classes
  $: themeClasses = getThemeClasses($currentTheme, variant, $focusLevel, $feelingLevel);
</script>

<ShadcnButton
  variant={variant}
  size={size}
  class={themeClasses}
  {...props}
>
  <slot />
</ShadcnButton>
```

This approach leverages existing components while adding theme-specific styling.

#### Option 2: Custom Component Library

Build components from scratch with theme adaptation as a core principle:

```svelte
<!-- Custom Button Component -->
<script lang="ts">
  import { currentTheme, focusLevel, feelingLevel } from '$lib/stores/themeStore';
  
  export let variant = "default";
  export let size = "default";
  export let disabled = false;
  
  // Compute component properties based on theme, focus, and feeling
  $: baseClasses = getBaseClasses(variant, size);
  $: themeClasses = getThemeClasses($currentTheme, variant);
  $: focusClasses = getFocusClasses($focusLevel);
  $: feelingClasses = getFeelingClasses($feelingLevel);
</script>

<button
  class={`${baseClasses} ${themeClasses} ${focusClasses} ${feelingClasses}`}
  disabled={disabled}
>
  <slot />
</button>
```

This approach offers maximum flexibility but requires more development effort.

#### Option 3: CSS Variable-Based Approach

Use CSS variables extensively to control component appearance:

```css
/* Base component styles */
.btn {
  padding: var(--btn-padding);
  border-radius: var(--btn-radius);
  font-size: var(--btn-font-size);
  background: var(--btn-bg);
  color: var(--btn-color);
  transition: var(--animation-speed) ease;
}

/* Theme-specific variables */
.theme-evangelion {
  --btn-padding: 0.75rem 1.5rem;
  --btn-radius: 0;
  --btn-font-size: 0.875rem;
  --btn-bg: rgba(236, 82, 82, 0.9);
  --btn-color: #ffffff;
}

.theme-forestry {
  --btn-padding: 0.5rem 1rem;
  --btn-radius: 0.375rem;
  --btn-font-size: 1rem;
  --btn-bg: var(--color-walnut-shell);
  --btn-color: var(--color-speed-of-light);
}

/* Focus/feeling adjustments */
[data-focus="high"] {
  --btn-padding: 0.5rem 1rem;
  --btn-font-size: 0.75rem;
}

[data-feeling="high"] {
  --btn-radius: 1rem;
  --btn-bg: linear-gradient(45deg, var(--color-primary), var(--color-accent));
}
```

This approach is efficient but may be less flexible for complex component variations.

### 9.3 Component Theme Registry

To systematically manage component variations across themes, we'll create a component theme registry:

```typescript
// src/lib/theme/componentRegistry.ts
import type { ComponentTheme } from '$lib/types';

export const buttonThemes: Record<string, ComponentTheme> = {
  [THEMES.EVANGELION]: {
    base: 'font-mono uppercase tracking-wider border-0',
    variants: {
      primary: 'bg-red-500 text-white hover:bg-red-600',
      secondary: 'bg-gray-800 text-white hover:bg-gray-700',
      ghost: 'bg-transparent text-red-500 hover:bg-red-500/10'
    },
    focusAdjustments: {
      high: 'text-xs py-1 px-3',
      medium: 'text-sm py-2 px-4',
      low: 'text-base py-3 px-6'
    },
    feelingAdjustments: {
      high: 'animate-pulse border border-red-500/50',
      medium: 'transition-all duration-300',
      low: 'transition-none'
    }
  },
  [THEMES.FORESTRY]: {
    base: 'font-sans rounded-md border border-walnut-shell/20',
    variants: {
      primary: 'bg-walnut-shell text-speed-of-light hover:bg-walnut-shell/90',
      secondary: 'bg-green-tone-ink text-speed-of-light hover:bg-green-tone-ink/90',
      ghost: 'bg-transparent text-shadow-moss hover:bg-shadow-moss/10'
    },
    focusAdjustments: {
      high: 'text-sm py-1.5 px-3',
      medium: 'text-base py-2 px-4',
      low: 'text-lg py-3 px-6'
    },
    feelingAdjustments: {
      high: 'shadow-lg transform transition hover:-translate-y-1',
      medium: 'shadow transition-all duration-300',
      low: 'shadow-sm transition-none'
    }
  }
};

// Similar registries for other components
```

### 9.4 Component Library Structure

Our component library will be organized as follows:

```
src/lib/components/
├── ui/                 # Base components (from shadcn or custom)
│   ├── button.ts
│   ├── card.ts
│   └── ...
├── themed/             # Theme-aware component wrappers
│   ├── Button.svelte
│   ├── Card.svelte
│   └── ...
└── composite/          # Higher-order components
    ├── ThemeCard.svelte
    ├── TaskItem.svelte
    └── ...
```

### 9.5 Implementation Plan

#### Phase 1: Component Theme Registry
1. Define theme-specific styles for core components
2. Create focus/feeling adjustment mappings
3. Build utility functions for class generation

#### Phase 2: Theme-Aware Component Wrappers
1. Create wrapper components for all UI elements
2. Implement theme, focus, and feeling reactivity
3. Ensure proper slot and prop forwarding

#### Phase 3: Component Showcase & Documentation
1. Create a comprehensive component showcase
2. Document theme-specific variations
3. Provide usage examples with different themes/focus/feeling levels

#### Phase 4: Migration & Refinement
1. Replace direct UI component usage with themed wrappers
2. Refine component behavior based on testing
3. Optimize performance for theme switching
