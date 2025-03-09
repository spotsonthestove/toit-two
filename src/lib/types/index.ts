/**
 * Type definitions for the application
 */

/**
 * Component theme configuration
 */
export interface ComponentTheme {
  /**
   * Base classes applied to all variants
   */
  base: string;
  
  /**
   * Classes specific to each variant
   */
  variants: Record<string, string>;
  
  /**
   * Classes applied based on focus level
   */
  focusAdjustments: {
    low: string;
    medium: string;
    high: string;
  };
  
  /**
   * Classes applied based on feeling level
   */
  feelingAdjustments: {
    low: string;
    medium: string;
    high: string;
  };
}

/**
 * Theme preset configuration
 */
export interface ThemePreset {
  /**
   * Focus level (1-10)
   */
  focus: number;
  
  /**
   * Feeling level (1-10)
   */
  feeling: number;
  
  /**
   * Display name of the preset
   */
  name: string;
}

/**
 * Theme features configuration
 */
export interface ThemeFeatures {
  /**
   * Whether to use monospace fonts
   */
  monospace: boolean;
  
  /**
   * Whether to use terminal-like text styling
   */
  terminalText: boolean;
  
  /**
   * Whether to use decorative patterns
   */
  decorativePatterns: boolean;
  
  /**
   * Whether to use glass effects
   */
  glassEffects: boolean;
} 