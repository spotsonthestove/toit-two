<!-- src/lib/components/ThemeTransition.svelte -->
<script lang="ts">
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