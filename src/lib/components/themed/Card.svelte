<!-- src/lib/components/themed/Card.svelte -->
<script lang="ts">
  import { Card as ShadcnCard } from "$lib/components/ui/card";
  import { 
    currentTheme, 
    focusLevel, 
    feelingLevel,
    themeFeatures
  } from '$lib/stores/themeStore';
  import { getComponentClasses } from '$lib/utils/themeUtils';
  
  // Props
  /**
   * Card variant
   * @type {"default" | "glass" | "neumorph"}
   */
  export let variant: "default" | "glass" | "neumorph" = "default";
  
  /**
   * Additional CSS classes
   */
  export let class_ = "";
  
  /**
   * Additional attributes to pass to the card
   */
  export let {...props} = {};
  
  // Derive theme-specific classes
  $: themeClasses = getComponentClasses(
    $currentTheme,
    'card',
    variant,
    $focusLevel,
    $feelingLevel
  );
  
  // Add glass class if glass effects are enabled
  $: glassClass = variant === 'glass' && $themeFeatures.glassEffects ? 'glass-panel' : '';
  
  // Add neumorphic class if variant is neumorph
  $: neumorphClass = variant === 'neumorph' ? 'neumorph-panel' : '';
  
  // Combine all classes
  $: combinedClasses = `${themeClasses} ${glassClass} ${neumorphClass} ${class_}`;
</script>

<ShadcnCard
  class={combinedClasses}
  {...props}
>
  <slot />
</ShadcnCard> 