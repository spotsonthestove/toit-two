<!-- src/routes/theme-test/+page.svelte -->
<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Card } from "$lib/components/ui/card";
  import { Input } from "$lib/components/ui/input";
  import { Select } from "$lib/components/ui/select";
  import { 
    focusLevel, 
    feelingLevel, 
    currentTheme,
    themeFeatures
  } from '$lib/stores/themeStore';
</script>

<div class="container mx-auto p-4">
  <h1 class="text-3xl mb-8" data-terminal-text="true">Theme Test Page</h1>
  
  <!-- Test Cards -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
    <!-- Neumorphic Card -->
    <Card class="neumorph">
      <div class="card-header">
        <h2 class="text-xl" data-terminal-text="true">Neumorphic Card</h2>
      </div>
      <div class="p-4">
        <p class="mb-4">This card demonstrates the neumorphic style with monospace text.</p>
        <Button variant="default">Test Button</Button>
      </div>
    </Card>
    
    <!-- Glass Card -->
    <Card class="glass">
      <div class="card-header">
        <h2 class="text-xl" data-terminal-text="true">Glass Card</h2>
      </div>
      <div class="p-4">
        <p class="mb-4">This card shows the glass effect with terminal-like text.</p>
        <Button variant="default">Test Button</Button>
      </div>
    </Card>
    
    <!-- Standard Card -->
    <Card>
      <div class="card-header">
        <h2 class="text-xl" data-terminal-text="true">Standard Card</h2>
      </div>
      <div class="p-4">
        <p class="mb-4">This is a standard card with monospace text elements.</p>
        <Button variant="default">Test Button</Button>
      </div>
    </Card>
  </div>
  
  <!-- Interactive Elements -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
    <!-- Form Elements -->
    <div class="space-y-4">
      <h2 class="text-xl" data-terminal-text="true">Form Elements</h2>
      
      <div>
        <label for="test-input" class="block mb-2" data-monospace="true">Input Field</label>
        <Input id="test-input" type="text" placeholder="Enter text..." />
      </div>
      
      <div>
        <label for="test-select" class="block mb-2" data-monospace="true">Select Dropdown</label>
        <Select>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
          <option value="3">Option 3</option>
        </Select>
      </div>
      
      <div>
        <label for="test-checkbox" class="block mb-2" data-monospace="true">Checkbox</label>
        <input id="test-checkbox" type="checkbox" class="form-checkbox" />
      </div>
    </div>
    
    <!-- Button Variants -->
    <div class="space-y-4">
      <h2 class="text-xl" data-terminal-text="true">Button Variants</h2>
      
      <div class="space-y-2">
        <Button variant="default" class="w-full">Default Button</Button>
        <Button variant="secondary" class="w-full">Secondary Button</Button>
        <Button variant="outline" class="w-full">Outline Button</Button>
        <Button variant="ghost" class="w-full">Ghost Button</Button>
      </div>
    </div>
  </div>
  
  <!-- Theme Info -->
  <div class="fixed bottom-4 left-4 z-50">
    <Card class="glass p-4 w-80">
      <h3 class="text-lg mb-4" data-terminal-text="true">Current Theme State</h3>
      <div class="text-sm space-y-2">
        <p data-monospace="true">Theme: {$currentTheme}</p>
        <p data-monospace="true">Focus: {$focusLevel}</p>
        <p data-monospace="true">Feeling: {$feelingLevel}</p>
        <p data-monospace="true">Monospace: {$themeFeatures.monospace ? 'Enabled' : 'Disabled'}</p>
        <p data-monospace="true">Terminal Text: {$themeFeatures.terminalText ? 'Enabled' : 'Disabled'}</p>
        <p data-monospace="true">Decorative Patterns: {$themeFeatures.decorativePatterns ? 'Enabled' : 'Disabled'}</p>
        <p data-monospace="true">Glass Effects: {$themeFeatures.glassEffects ? 'Enabled' : 'Disabled'}</p>
      </div>
    </Card>
  </div>
</div>

<style>
  /* Use the glass-panel class from the global styles instead of custom implementation */
  /* .glass {
    background-color: rgba(var(--color-background-rgb), var(--glass-opacity));
    backdrop-filter: blur(var(--glass-blur));
    border: 1px solid rgba(var(--color-accent-rgb), 0.3);
  } */
</style> 