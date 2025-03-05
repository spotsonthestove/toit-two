<!-- src/lib/components/ThemeTransition.svelte -->
<script lang="ts">
  import { fade } from 'svelte/transition';
  import { currentTheme } from '$lib/stores/themeStore';
  import { isTransitioning } from '$lib/utils/themeTransitionManager';
  
  // Track previous theme for display
  let previousTheme = '';
  
  // Update previous theme when current theme changes
  $: if (!$isTransitioning && $currentTheme !== previousTheme) {
    previousTheme = $currentTheme;
  }
</script>

{#if $isTransitioning}
  <div
    class="theme-transition-overlay"
    transition:fade={{ duration: 300 }}
  >
    <div class="theme-transition-content">
      <span class="theme-transition-text">Switching to {$currentTheme} theme...</span>
    </div>
  </div>
{/if}

<style>
  .theme-transition-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--color-background);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    opacity: 0.7;
  }
  
  .theme-transition-content {
    text-align: center;
    padding: 2rem;
    border-radius: var(--border-radius);
    background-color: rgba(var(--color-background-rgb), 0.8);
    box-shadow: 0 0 20px rgba(var(--color-accent-rgb, 0, 0, 0), 0.3);
    backdrop-filter: blur(5px);
  }
  
  .theme-transition-text {
    font-family: var(--font-mono);
    color: var(--color-text);
    font-size: 1.25rem;
  }
</style> 