# Theme-Driven Style Guide

This document serves as the central reference for our theme-driven component system, detailing how components adapt to different themes, focus levels, and feeling levels.

## 1. Theme System Overview

Our application uses a multi-dimensional theming system that allows components to adapt along three primary axes:

1. **Theme Identity**: The overall visual language (e.g., Evangelion, Forestry)
2. **Focus Level**: Controls information density and UI complexity (1-10 scale)
3. **Feeling Level**: Controls visual richness and playfulness (1-10 scale)

### 1.1 Theme Dimensions Explained

#### Theme Identity
Each theme has a distinct visual language, color palette, and component styling:

- **Evangelion**: Industrial, technical, high-contrast with angular elements
- **Forestry**: Organic, natural, soft with rounded elements

#### Focus Level (1-10)
Controls how information-dense and streamlined the UI appears:

- **Low (1-3)**: Spacious layouts, larger text, fewer elements visible at once
- **Medium (4-7)**: Balanced layouts with moderate information density
- **High (8-10)**: Dense layouts, compact elements, maximum information visibility

#### Feeling Level (1-10)
Controls the visual richness and playfulness of the UI:

- **Low (1-3)**: Utilitarian, monochromatic, minimal decoration
- **Medium (4-7)**: Balanced visual elements with moderate decoration
- **High (8-10)**: Rich visuals, animations, decorative elements

## 2. Color Palettes

### 2.1 Evangelion Theme

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Primary Red | `#EC5252` | Primary actions, highlights |
| Secondary Blue | `#1A1A1A` | Secondary elements, backgrounds |
| Accent Yellow | `#FFC107` | Accents, warnings |
| Background Dark | `#121212` | Main background |
| Surface Dark | `#1E1E1E` | Card backgrounds |
| Text Light | `#FFFFFF` | Primary text |
| Text Secondary | `#B0B0B0` | Secondary text |

### 2.2 Forestry Theme

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Shadow Moss | `#2C3830` | Primary text, borders |
| Speed of Light | `#F6F4EF` | Backgrounds, light elements |
| Mariana Black | `#1B1E1E` | Dark accents |
| Walnut Shell | `#AA8344` | Primary actions |
| Good as Gold | `#D3BA75` | Secondary actions, highlights |
| Green Tone Ink | `#47553C` | Tertiary elements |

## 3. Typography

### 3.1 Font Families

- **Sans-serif**: `'Inter', system-ui, sans-serif`
- **Monospace**: `'JetBrains Mono', monospace`

### 3.2 Type Scale

| Size Name | Size Value | Line Height | Usage |
|-----------|------------|-------------|-------|
| xs | 0.75rem | 1rem | Small labels, metadata |
| sm | 0.875rem | 1.25rem | Secondary text, buttons |
| base | 1rem | 1.5rem | Body text |
| lg | 1.125rem | 1.75rem | Large text, subheadings |
| xl | 1.25rem | 1.75rem | Section headings |
| 2xl | 1.5rem | 2rem | Page headings |
| 3xl | 1.875rem | 2.25rem | Major headings |
| 4xl | 2.25rem | 2.5rem | Hero text |

### 3.3 Focus Level Typography Adjustments

| Focus Level | Body Text | Headings | Line Height |
|-------------|-----------|----------|-------------|
| Low (1-3) | +0.125rem | +0.25rem | +0.25 |
| Medium (4-7) | Base size | Base size | Base |
| High (8-10) | -0.125rem | -0.125rem | -0.125 |

### 3.4 Feeling Level Typography Adjustments

| Feeling Level | Font Weight | Letter Spacing | Text Decoration |
|---------------|-------------|----------------|----------------|
| Low (1-3) | Normal/Regular | Normal | None |
| Medium (4-7) | Medium | Slight tracking | Minimal |
| High (8-10) | Bold for emphasis | Increased tracking | Decorative elements |

## 4. Component Styling

### 4.1 Buttons

#### Base Styling
- Height: 2.5rem (40px)
- Padding: 0.5rem 1rem (8px 16px)
- Border radius: 0.375rem (6px)
- Transition: 150ms ease

#### Theme Variations

**Evangelion**
- Sharp corners (0px radius)
- Monospace font
- Uppercase text
- High contrast colors

**Forestry**
- Rounded corners (6px radius)
- Sans-serif font
- Title case text
- Natural, earthy colors

#### Focus Level Adjustments

| Focus Level | Size | Padding | Font Size |
|-------------|------|---------|-----------|
| Low (1-3) | Large | 0.75rem 1.5rem | 1rem |
| Medium (4-7) | Medium | 0.5rem 1rem | 0.875rem |
| High (8-10) | Small | 0.375rem 0.75rem | 0.75rem |

#### Feeling Level Adjustments

| Feeling Level | Visual Effects | Transitions | Decorations |
|---------------|----------------|-------------|-------------|
| Low (1-3) | Minimal | Simple | None |
| Medium (4-7) | Moderate shadows | Standard hover effects | Subtle highlights |
| High (8-10) | Rich shadows | Complex animations | Decorative elements |

### 4.2 Cards

#### Base Styling
- Padding: 1rem (16px)
- Border radius: 0.5rem (8px)
- Background: Surface color
- Shadow: Light elevation shadow

#### Theme Variations

**Evangelion**
- Sharp corners with accent border
- Inner highlight lines
- Technical, grid-like layout
- High contrast header/content separation

**Forestry**
- Soft rounded corners
- Natural texture background
- Organic spacing
- Subtle shadows

#### Focus Level Adjustments

| Focus Level | Padding | Content Density | Information Hierarchy |
|-------------|---------|-----------------|------------------------|
| Low (1-3) | Spacious (1.5rem) | Low | Clear, separated sections |
| Medium (4-7) | Standard (1rem) | Medium | Balanced layout |
| High (8-10) | Compact (0.5rem) | High | Dense, efficient layout |

#### Feeling Level Adjustments

| Feeling Level | Visual Effects | Animations | Decorations |
|---------------|----------------|------------|-------------|
| Low (1-3) | Flat, minimal | None | None |
| Medium (4-7) | Subtle depth | Subtle transitions | Light accents |
| High (8-10) | Deep shadows, glass effects | Entrance/hover animations | Decorative patterns |

### 4.3 Form Elements

#### Base Styling
- Height: 2.5rem (40px)
- Padding: 0.5rem 0.75rem
- Border radius: 0.375rem (6px)
- Border: 1px solid border color

#### Theme Variations

**Evangelion**
- Sharp corners
- Inner glow on focus
- Technical appearance
- Monospace input text

**Forestry**
- Soft corners
- Natural border colors
- Organic appearance
- Sans-serif input text

#### Focus Level Adjustments

| Focus Level | Label Position | Required Indicators | Helper Text |
|-------------|----------------|---------------------|-------------|
| Low (1-3) | Above input, spacious | Subtle | Always visible |
| Medium (4-7) | Above input, standard | Standard | On focus/error |
| High (8-10) | Inline or floating | Prominent | Minimal |

#### Feeling Level Adjustments

| Feeling Level | Visual Effects | Interactions | Decorations |
|---------------|----------------|--------------|-------------|
| Low (1-3) | Minimal | Standard | None |
| Medium (4-7) | Subtle shadows | Enhanced focus states | Light accents |
| High (8-10) | Neumorphic or glass effects | Rich interactions | Decorative elements |

## 5. Layout & Spacing

### 5.1 Container Widths

| Breakpoint | Max Width | Usage |
|------------|-----------|-------|
| Default | 100% | Mobile devices |
| sm (640px) | 640px | Small tablets |
| md (768px) | 768px | Tablets |
| lg (1024px) | 1024px | Laptops |
| xl (1280px) | 1280px | Desktops |
| 2xl (1536px) | 1536px | Large displays |

### 5.2 Spacing Scale

| Size | Value | Usage |
|------|-------|-------|
| 0 | 0px | No spacing |
| 1 | 0.25rem (4px) | Minimal spacing |
| 2 | 0.5rem (8px) | Tight spacing |
| 3 | 0.75rem (12px) | Compact elements |
| 4 | 1rem (16px) | Standard spacing |
| 6 | 1.5rem (24px) | Related elements |
| 8 | 2rem (32px) | Section spacing |
| 12 | 3rem (48px) | Major sections |
| 16 | 4rem (64px) | Page sections |

### 5.3 Focus Level Spacing Adjustments

| Focus Level | Element Spacing | Section Spacing | Margins |
|-------------|-----------------|-----------------|---------|
| Low (1-3) | Increased by 25-50% | Increased by 25-50% | Generous |
| Medium (4-7) | Standard | Standard | Standard |
| High (8-10) | Reduced by 25-50% | Reduced by 25-50% | Minimal |

### 5.4 Feeling Level Layout Adjustments

| Feeling Level | Layout Style | Alignment | Visual Rhythm |
|---------------|--------------|-----------|---------------|
| Low (1-3) | Grid-based, structured | Strict alignment | Consistent |
| Medium (4-7) | Balanced | Standard alignment | Balanced |
| High (8-10) | Organic, flowing | Creative alignment | Dynamic |

## 6. Animations & Transitions

### 6.1 Animation Speeds

| Name | Duration | Usage |
|------|----------|-------|
| Fast | 150ms | Micro-interactions |
| Standard | 300ms | Most transitions |
| Slow | 500ms | Major transitions |
| Very Slow | 1000ms | Entrance animations |

### 6.2 Easing Functions

| Name | Value | Usage |
|------|-------|-------|
| Default | ease | General purpose |
| In | ease-in | Exits, disappearing elements |
| Out | ease-out | Entrances, appearing elements |
| In-Out | ease-in-out | Complex transitions |

### 6.3 Focus Level Animation Adjustments

| Focus Level | Animation Speed | Complexity | Frequency |
|-------------|-----------------|------------|-----------|
| Low (1-3) | Slower | Simple | Fewer animations |
| Medium (4-7) | Standard | Balanced | Standard |
| High (8-10) | Faster | Minimal | Essential only |

### 6.4 Feeling Level Animation Adjustments

| Feeling Level | Animation Richness | Effects | Playfulness |
|---------------|---------------------|---------|-------------|
| Low (1-3) | Minimal | Functional only | None |
| Medium (4-7) | Moderate | Enhanced feedback | Subtle |
| High (8-10) | Rich | Decorative animations | Playful elements |

## 7. Implementation Guidelines

### 7.1 Component Structure

All themed components should follow this structure:

1. Import base component (if using enhanced approach)
2. Import theme stores
3. Accept standard props plus theme-specific props
4. Compute derived classes based on theme, focus, and feeling
5. Apply classes to component

### 7.2 Class Generation

Use the theme registry to generate appropriate classes:

```typescript
function getThemeClasses(
  theme: string,
  component: string,
  variant: string,
  focus: number,
  feeling: number
): string {
  // Get component theme definition
  const themeConfig = componentThemes[component][theme];
  
  // Get base classes
  const baseClasses = themeConfig.base;
  
  // Get variant classes
  const variantClasses = themeConfig.variants[variant];
  
  // Determine focus level class
  const focusLevel = focus <= 3 ? 'low' : focus >= 8 ? 'high' : 'medium';
  const focusClasses = themeConfig.focusAdjustments[focusLevel];
  
  // Determine feeling level class
  const feelingLevel = feeling <= 3 ? 'low' : feeling >= 8 ? 'high' : 'medium';
  const feelingClasses = themeConfig.feelingAdjustments[feelingLevel];
  
  // Combine all classes
  return `${baseClasses} ${variantClasses} ${focusClasses} ${feelingClasses}`;
}
```

### 7.3 CSS Variables Strategy

Use CSS variables for theme-specific values:

1. Define base variables in `:root`
2. Override in theme classes (`.theme-evangelion`, etc.)
3. Further adjust in focus/feeling data attributes
4. Use variables in component styles

### 7.4 Performance Considerations

1. Memoize theme class calculations where possible
2. Use efficient CSS selectors
3. Minimize DOM updates during theme changes
4. Consider using CSS transitions for theme changes

## 8. Component Showcase

A comprehensive component showcase is available at `/design` and `/theme-test` routes, demonstrating:

1. All components in different themes
2. Focus level adjustments
3. Feeling level adjustments
4. Interactive controls for live adjustment

## 9. Adding New Themes

To add a new theme:

1. Define theme constants in `themeStore.ts`
2. Add theme features configuration
3. Create theme-specific CSS in appropriate files
4. Add component theme definitions to the registry
5. Update the theme switcher to include the new theme
6. Create showcase examples

## 10. Best Practices

1. Always use themed components instead of base components
2. Test components across the full range of focus and feeling levels
3. Ensure accessibility across all theme variations
4. Document theme-specific behaviors
5. Use the component showcase to verify changes 