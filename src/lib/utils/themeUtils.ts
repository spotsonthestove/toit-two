/**
 * Theme utility functions for component styling
 */

import { THEMES } from '$lib/stores/themeStore';
import type { ComponentTheme } from '$lib/types';

// Component theme registry
// This would ideally be in a separate file as it grows
const componentThemes: Record<string, Record<string, ComponentTheme>> = {
  button: {
    [THEMES.EVANGELION]: {
      base: 'font-mono uppercase tracking-wider',
      variants: {
        default: 'bg-[#EC5252] text-white hover:bg-[#D64545] rounded-none border-l-2 border-[#FFC107]',
        secondary: 'bg-[#1A1A1A] text-white hover:bg-[#2A2A2A] rounded-none border-l-2 border-[#EC5252]',
        outline: 'bg-transparent border border-[#EC5252] text-[#EC5252] hover:bg-[#EC5252]/10 rounded-none',
        ghost: 'bg-transparent text-[#EC5252] hover:bg-[#EC5252]/10 rounded-none',
        destructive: 'bg-[#FF3333] text-white hover:bg-[#CC0000] rounded-none',
        link: 'text-[#EC5252] underline-offset-4 hover:underline rounded-none p-0 h-auto'
      },
      focusAdjustments: {
        low: 'text-base py-3 px-6',
        medium: 'text-sm py-2 px-4',
        high: 'text-xs py-1 px-3'
      },
      feelingAdjustments: {
        low: 'transition-none',
        medium: 'transition-all duration-200 hover:shadow',
        high: 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1'
      }
    },
    [THEMES.FORESTRY]: {
      base: 'font-sans',
      variants: {
        default: 'bg-walnut-shell text-speed-of-light hover:bg-walnut-shell/90 rounded-md',
        secondary: 'bg-green-tone-ink text-speed-of-light hover:bg-green-tone-ink/90 rounded-md',
        outline: 'bg-transparent border border-walnut-shell text-shadow-moss hover:bg-walnut-shell/10 rounded-md',
        ghost: 'bg-transparent text-shadow-moss hover:bg-shadow-moss/10 rounded-md',
        destructive: 'bg-mariana-black text-speed-of-light hover:bg-mariana-black/90 rounded-md',
        link: 'text-walnut-shell underline-offset-4 hover:underline rounded-none p-0 h-auto'
      },
      focusAdjustments: {
        low: 'text-base py-3 px-6',
        medium: 'text-sm py-2 px-4',
        high: 'text-xs py-1 px-3'
      },
      feelingAdjustments: {
        low: 'transition-none',
        medium: 'transition-all duration-200 hover:shadow',
        high: 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1'
      }
    }
  },
  
  // Card component
  card: {
    [THEMES.EVANGELION]: {
      base: 'border-0 overflow-hidden',
      variants: {
        default: 'bg-[#1E1E1E] text-white border-l-2 border-[#EC5252] rounded-none',
        glass: 'bg-transparent backdrop-blur-md border border-[#EC5252]/30 rounded-none',
        neumorph: 'bg-[#1E1E1E] border-t border-l border-[#333333] border-b border-r border-[#111111] rounded-none'
      },
      focusAdjustments: {
        low: 'p-6 space-y-4',
        medium: 'p-4 space-y-3',
        high: 'p-2 space-y-2'
      },
      feelingAdjustments: {
        low: 'shadow-none',
        medium: 'shadow-md',
        high: 'shadow-lg before:absolute before:inset-0 before:bg-gradient-to-br before:from-[#EC5252]/5 before:to-transparent before:z-0 before:pointer-events-none'
      }
    },
    [THEMES.FORESTRY]: {
      base: 'overflow-hidden',
      variants: {
        default: 'bg-speed-of-light text-shadow-moss border border-walnut-shell/20 rounded-lg',
        glass: 'bg-transparent backdrop-blur-md border border-walnut-shell/20 rounded-lg',
        neumorph: 'bg-speed-of-light shadow-neumorph border-none rounded-lg'
      },
      focusAdjustments: {
        low: 'p-6 space-y-4',
        medium: 'p-4 space-y-3',
        high: 'p-2 space-y-2'
      },
      feelingAdjustments: {
        low: 'shadow-sm',
        medium: 'shadow-md hover:shadow-lg transition-shadow duration-300',
        high: 'shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1'
      }
    }
  },
  
  // Add more components as needed
};

/**
 * Get focus level category based on numeric value
 * @param focus Focus level (1-10)
 * @returns Focus category (low, medium, high)
 */
export function getFocusCategory(focus: number): 'low' | 'medium' | 'high' {
  return focus <= 3 ? 'low' : focus >= 8 ? 'high' : 'medium';
}

/**
 * Get feeling level category based on numeric value
 * @param feeling Feeling level (1-10)
 * @returns Feeling category (low, medium, high)
 */
export function getFeelingCategory(feeling: number): 'low' | 'medium' | 'high' {
  return feeling <= 3 ? 'low' : feeling >= 8 ? 'high' : 'medium';
}

/**
 * Get component classes based on theme, component, variant, focus, and feeling
 * @param theme Current theme
 * @param component Component name
 * @param variant Component variant
 * @param focus Focus level (1-10)
 * @param feeling Feeling level (1-10)
 * @returns Combined CSS classes
 */
export function getComponentClasses(
  theme: string,
  component: string,
  variant: string,
  focus: number,
  feeling: number
): string {
  // Check if component exists in registry
  if (!componentThemes[component] || !componentThemes[component][theme]) {
    console.warn(`No theme configuration found for ${component} in ${theme}`);
    return '';
  }
  
  const themeConfig = componentThemes[component][theme];
  
  // Get base classes
  const baseClasses = themeConfig.base;
  
  // Get variant classes
  const variantClasses = themeConfig.variants[variant] || themeConfig.variants.default;
  
  // Get focus level classes
  const focusCategory = getFocusCategory(focus);
  const focusClasses = themeConfig.focusAdjustments[focusCategory];
  
  // Get feeling level classes
  const feelingCategory = getFeelingCategory(feeling);
  const feelingClasses = themeConfig.feelingAdjustments[feelingCategory];
  
  // Combine all classes
  return `${baseClasses} ${variantClasses} ${focusClasses} ${feelingClasses}`;
} 