<!-- src/lib/components/themed/Button.svelte -->
<script lang="ts">
  import { Button as ShadcnButton } from "$lib/components/ui/button";
  import { 
    currentTheme, 
    focusLevel, 
    feelingLevel,
    THEMES
  } from '$lib/stores/themeStore';
  import { getComponentClasses } from '$lib/utils/themeUtils';
  
  // Props
  /**
   * The button variant
   * @type {"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"}
   */
  export let variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" = "default";
  
  /**
   * The button size
   * @type {"default" | "sm" | "lg" | "icon"}
   */
  export let size: "default" | "sm" | "lg" | "icon" = "default";
  
  /**
   * Whether the button is disabled
   */
  export let disabled = false;
  
  /**
   * Additional CSS classes
   */
  export let class_ = "";
  
  /**
   * Additional attributes to pass to the button
   */
  export let {...props} = {};
  
  // Derive theme-specific classes
  $: themeClasses = getComponentClasses(
    $currentTheme,
    'button',
    variant,
    $focusLevel,
    $feelingLevel
  );
  
  // Combine all classes
  $: combinedClasses = `${themeClasses} ${class_}`;
</script>

<ShadcnButton
  {variant}
  {size}
  {disabled}
  class={combinedClasses}
  {...props}
>
  <slot />
</ShadcnButton> 