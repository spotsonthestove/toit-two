<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { 
    currentTheme, 
    focusLevel, 
    feelingLevel, 
    themeFeatures,
    THEMES
  } from '$lib/stores/themeStore';
  
  // Derived values for theme application
  $: themeClass = $currentTheme !== THEMES.FORESTRY ? `theme-${$currentTheme}` : '';
  
  // CSS variables to apply
  $: themeStyles = {
    '--focus-level': $focusLevel,
    '--feeling-level': $feelingLevel
  };
  
  // Feature flags based on focus/feeling levels
  $: focusClass = $focusLevel >= 8 ? 'high' : $focusLevel <= 3 ? 'low' : 'medium';
  $: feelingClass = $feelingLevel >= 8 ? 'high' : $feelingLevel <= 3 ? 'low' : 'medium';
  
  // Convert theme styles object to CSS string
  $: styleString = Object.entries(themeStyles)
    .map(([key, value]) => `${key}:${value}`)
    .join(';');
  
  // Feature attributes from theme features
  $: featureAttributes = Object.entries($themeFeatures).reduce((acc, [key, value]) => {
    acc[`data-${key}`] = value.toString();
    return acc;
  }, {} as Record<string, string>);
  
  // Add focus and feeling classes
  $: featureAttributes['data-focus'] = focusClass;
  $: featureAttributes['data-feeling'] = feelingClass;
</script>

<div 
  class={themeClass}
  style={styleString}
  {...featureAttributes}
>
  <slot />
</div> 