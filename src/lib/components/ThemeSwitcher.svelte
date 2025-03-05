<!-- src/lib/components/ThemeSwitcher.svelte -->
<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { 
    currentTheme, 
    focusLevel, 
    feelingLevel, 
    THEMES, 
    PRESETS,
    applyPreset
  } from '$lib/stores/themeStore';
  import { debounce } from '$lib/utils/themeTransitionManager';
  
  // Local state
  let showThemePanel = false;
  
  // Debounced focus/feeling updates
  const debouncedFocusUpdate = debounce((value: number) => {
    focusLevel.set(value);
  }, 100);
  
  const debouncedFeelingUpdate = debounce((value: number) => {
    feelingLevel.set(value);
  }, 100);
  
  // Local values for sliders (to prevent jank during debounce)
  let localFocus = $focusLevel;
  let localFeeling = $feelingLevel;
  
  // Update local values when store values change
  $: localFocus = $focusLevel;
  $: localFeeling = $feelingLevel;
  
  // Handle focus change with debounce
  function handleFocusChange(event: Event) {
    const value = parseInt((event.target as HTMLInputElement).value);
    localFocus = value;
    debouncedFocusUpdate(value);
  }
  
  // Handle feeling change with debounce
  function handleFeelingChange(event: Event) {
    const value = parseInt((event.target as HTMLInputElement).value);
    localFeeling = value;
    debouncedFeelingUpdate(value);
  }
  
  // Handle preset application
  function handlePresetClick(key: string) {
    if (key in PRESETS) {
      applyPreset(key as keyof typeof PRESETS);
    }
  }
</script>

<div class="fixed bottom-4 right-4 z-50">
  <button
    class="theme-toggle-button"
    on:click={() => showThemePanel = !showThemePanel}
    aria-label="Toggle theme settings"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  </button>
  
  {#if showThemePanel}
    <div
      class="theme-panel glass-panel"
      in:fly={{ y: 20, duration: 150, easing: cubicOut }}
      out:fade={{ duration: 150 }}
    >
      <div class="theme-controls">
        <!-- Focus Control -->
        <div class="control-group">
          <div class="flex justify-between mb-1">
            <label for="focus-slider" class="text-sm" data-monospace="true">Focus: {localFocus}</label>
            <span class="text-sm opacity-70">
              {localFocus <= 3 ? 'Relaxed' : localFocus >= 8 ? 'Intense' : 'Balanced'}
            </span>
          </div>
          <input 
            id="focus-slider"
            type="range" 
            min="1" 
            max="10" 
            step="1"
            value={localFocus}
            on:input={handleFocusChange}
            class="w-full accent-primary"
          />
        </div>
        
        <!-- Feeling Control -->
        <div class="control-group">
          <div class="flex justify-between mb-1">
            <label for="feeling-slider" class="text-sm" data-monospace="true">Feeling: {localFeeling}</label>
            <span class="text-sm opacity-70">
              {localFeeling <= 3 ? 'Utilitarian' : localFeeling >= 8 ? 'Playful' : 'Balanced'}
            </span>
          </div>
          <input 
            id="feeling-slider"
            type="range" 
            min="1" 
            max="10" 
            step="1"
            value={localFeeling}
            on:input={handleFeelingChange}
            class="w-full accent-primary"
          />
        </div>
        
        <!-- Presets -->
        <div class="presets">
          <label class="block text-sm mb-2" data-monospace="true">Presets</label>
          <div class="grid grid-cols-3 gap-2">
            <button 
              class="preset-button"
              on:click={() => handlePresetClick('MINIMALIST')}
            >
              Minimalist
            </button>
            <button 
              class="preset-button"
              on:click={() => handlePresetClick('BALANCED')}
            >
              Balanced
            </button>
            <button 
              class="preset-button"
              on:click={() => handlePresetClick('CREATIVE')}
            >
              Creative
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .theme-toggle-button {
    background-color: var(--color-background);
    border: 1px solid rgba(var(--color-primary-rgb), 0.2);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all var(--animation-speed) ease;
    box-shadow: var(--shadow-light);
  }
  
  .theme-toggle-button:hover {
    transform: scale(1.1);
    box-shadow: var(--shadow-light);
  }
  
  .theme-panel {
    position: absolute;
    bottom: 60px;
    right: 0;
    width: 300px;
    padding: 1rem;
    border-radius: var(--border-radius);
  }
  
  .theme-controls {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .control-group {
    margin-bottom: 1rem;
  }
  
  .presets {
    margin-top: 1rem;
  }
  
  .preset-button {
    background-color: var(--color-background);
    border: 1px solid rgba(var(--color-primary-rgb), 0.2);
    border-radius: var(--border-radius);
    padding: 0.5rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all var(--animation-speed) ease;
  }
  
  .preset-button:hover {
    background-color: rgba(var(--color-accent-rgb), 0.1);
    border-color: var(--color-accent);
  }
</style> 