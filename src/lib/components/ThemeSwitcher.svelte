<!-- src/lib/components/ThemeSwitcher.svelte -->
<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { 
    themeName, 
    focusLevel, 
    feelingLevel, 
    THEMES, 
    PRESETS,
    applyPreset,
    type Theme,
    type Preset
  } from '$lib/stores/themeStore';
  
  // Local state
  let showThemePanel = false;
  
  // Handle theme change with animation
  function changeTheme(newTheme: Theme) {
    // Use a transition delay to allow for animation
    setTimeout(() => {
      themeName.set(newTheme);
    }, 300);
  }

  // Handle preset application
  function handlePreset(key: string) {
    applyPreset(key as Preset);
  }
</script>

<div class="fixed bottom-4 right-4 z-50">
  <!-- Theme toggle button -->
  <button 
    class="neumorph-panel-sm p-3 rounded-full transition-all duration-300 hover:scale-110"
    on:click={() => showThemePanel = !showThemePanel}
    aria-label="Toggle theme settings"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  </button>
  
  <!-- Theme panel -->
  {#if showThemePanel}
    <div 
      class="glass-panel w-80 absolute bottom-16 right-0 p-4 rounded-lg"
      transition:fly={{ y: 20, duration: 300, easing: cubicOut }}
    >
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
          class="w-full accent-primary"
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
          class="w-full accent-primary"
        />
      </div>
      
      <!-- Presets -->
      <div class="mt-6">
        <label class="block text-sm mb-2">Presets</label>
        <div class="grid grid-cols-3 gap-2">
          {#each Object.entries(PRESETS) as [key, preset]}
            <button 
              class="p-2 text-xs rounded-lg neumorph-panel-sm hover:neumorph-pressed transition-all duration-200"
              on:click={() => handlePreset(key)}
            >
              {preset.name}
            </button>
          {/each}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .glass-panel {
    background-color: rgba(var(--color-background-rgb), var(--glass-opacity));
    backdrop-filter: blur(var(--glass-blur));
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .neumorph-panel-sm {
    background-color: var(--color-background);
    box-shadow: var(--shadow-light);
  }
  
  .neumorph-pressed {
    background-color: var(--color-background);
    box-shadow: var(--shadow-inner);
  }
  
  input[type="range"] {
    -webkit-appearance: none;
    width: 100%;
    height: 4px;
    border-radius: 2px;
    background: var(--color-background);
    outline: none;
    box-shadow: var(--shadow-inner);
  }
  
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--color-primary);
    cursor: pointer;
    box-shadow: var(--shadow-light);
    transition: all 0.2s ease;
  }
  
  input[type="range"]::-webkit-slider-thumb:hover {
    transform: scale(1.1);
  }
  
  input[type="range"]::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--color-primary);
    cursor: pointer;
    box-shadow: var(--shadow-light);
    border: none;
    transition: all 0.2s ease;
  }
  
  input[type="range"]::-moz-range-thumb:hover {
    transform: scale(1.1);
  }
</style> 