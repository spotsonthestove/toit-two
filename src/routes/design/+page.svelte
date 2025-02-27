<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { Button } from "$lib/components/ui/button";
  import ToitTorus from '$lib/components/ToitTorus.svelte';

  // Sample tasks for ToitTorus demo
  const demoTasks = [
    {
      task_id: 'demo-1',
      session_id: 0,
      name: 'Research neumorphism',
      description: 'Look into neumorphic design principles',
      duration_minutes: 30,
      status: 'completed',
      created_at: new Date().toISOString()
    },
    {
      task_id: 'demo-2',
      session_id: 0,
      name: 'Create wireframes',
      description: 'Design initial wireframes for the app',
      duration_minutes: 45,
      status: 'completed',
      created_at: new Date().toISOString()
    },
    {
      task_id: 'demo-3',
      session_id: 0,
      name: 'Implement UI components',
      description: 'Build the core UI components',
      duration_minutes: 60,
      status: 'in_progress',
      created_at: new Date().toISOString()
    },
    {
      task_id: 'demo-4',
      session_id: 0,
      name: 'Test responsiveness',
      description: 'Ensure the design works on all devices',
      duration_minutes: 25,
      status: 'pending',
      created_at: new Date().toISOString()
    },
    {
      task_id: 'demo-5',
      session_id: 0,
      name: 'Gather feedback',
      description: 'Get user feedback on the new design',
      duration_minutes: 40,
      status: 'pending',
      created_at: new Date().toISOString()
    }
  ];

  // Color palette
  const forestryColors = [
    { name: 'Shadow Moss', class: 'bg-shadow-moss', text: 'text-white', hex: '#2C3830' },
    { name: 'The Speed of Light', class: 'bg-speed-of-light', text: 'text-shadow-moss', hex: '#F6F4EF' },
    { name: 'Mariana Black', class: 'bg-mariana-black', text: 'text-white', hex: '#1B1E1E' },
    { name: 'Walnut Shell', class: 'bg-walnut-shell', text: 'text-white', hex: '#AA8344' },
    { name: 'Good as Gold', class: 'bg-good-as-gold', text: 'text-shadow-moss', hex: '#D3BA75' },
    { name: 'Green Tone Ink', class: 'bg-green-tone-ink', text: 'text-white', hex: '#47553C' },
  ];

  const neutralColors = [
    { name: 'neugray-50', class: 'bg-neugray-50', text: 'text-neugray-900' },
    { name: 'neugray-100', class: 'bg-neugray-100', text: 'text-neugray-900' },
    { name: 'neugray-200', class: 'bg-neugray-200', text: 'text-neugray-900' },
    { name: 'neugray-300', class: 'bg-neugray-300', text: 'text-neugray-900' },
    { name: 'neugray-400', class: 'bg-neugray-400', text: 'text-white' },
    { name: 'neugray-500', class: 'bg-neugray-500', text: 'text-white' },
    { name: 'neugray-600', class: 'bg-neugray-600', text: 'text-white' },
    { name: 'neugray-700', class: 'bg-neugray-700', text: 'text-white' },
    { name: 'neugray-800', class: 'bg-neugray-800', text: 'text-white' },
    { name: 'neugray-900', class: 'bg-neugray-900', text: 'text-white' },
  ];
</script>

<svelte:head>
  <title>Toit Design System</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="mb-8" in:fade={{ duration: 300, delay: 100 }}>
    <h1 class="text-3xl font-bold forestry-gradient-text mb-2">Toit Design System</h1>
    <p class="text-shadow-moss">A showcase of neumorphic and glassmorphic UI components with forestry colors</p>
  </div>

  <!-- Color Palette -->
  <section class="mb-12 glass-panel p-6" in:fade={{ duration: 300, delay: 200 }}>
    <h2 class="text-2xl font-semibold mb-6 text-shadow-moss">Forestry Color Palette</h2>
    
    <div class="mb-8">
      <h3 class="text-lg font-medium mb-4 text-shadow-moss">Primary Colors</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {#each forestryColors as color, i}
          <div 
            class="aspect-square rounded-lg flex flex-col items-center justify-center {color.class} {color.text}"
            in:fly={{ y: 20, delay: i * 50, duration: 300 }}
          >
            <span class="font-medium">{color.name}</span>
            <span class="text-sm mt-1">{color.hex}</span>
          </div>
        {/each}
      </div>
    </div>
    
    <div>
      <h3 class="text-lg font-medium mb-4 text-shadow-moss">Neutral Colors</h3>
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {#each neutralColors as color, i}
          <div 
            class="aspect-square rounded-lg flex flex-col items-center justify-center {color.class} {color.text}"
            in:fly={{ y: 20, delay: i * 50, duration: 300 }}
          >
            <span class="font-medium">{color.name}</span>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Neumorphic Components -->
  <section class="mb-12" in:fade={{ duration: 300, delay: 300 }}>
    <h2 class="text-2xl font-semibold mb-6 text-shadow-moss">Neumorphic Components</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Panels -->
      <div class="neumorph-panel p-6">
        <h3 class="text-lg font-medium mb-4 text-shadow-moss">Panels</h3>
        
        <div class="space-y-6">
          <div>
            <p class="text-sm text-shadow-moss mb-2">Standard Panel</p>
            <div class="neumorph-panel p-4">
              <p class="text-shadow-moss">This is a standard neumorphic panel</p>
            </div>
          </div>
          
          <div>
            <p class="text-sm text-shadow-moss mb-2">Small Panel</p>
            <div class="neumorph-panel-sm p-4">
              <p class="text-shadow-moss">This is a smaller neumorphic panel</p>
            </div>
          </div>
          
          <div>
            <p class="text-sm text-shadow-moss mb-2">Pressed Panel</p>
            <div class="neumorph-pressed p-4">
              <p class="text-shadow-moss">This is a pressed neumorphic panel</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Buttons -->
      <div class="neumorph-panel p-6">
        <h3 class="text-lg font-medium mb-4 text-shadow-moss">Buttons</h3>
        
        <div class="space-y-6">
          <div>
            <p class="text-sm text-shadow-moss mb-2">Primary Button</p>
            <div class="flex gap-4">
              <Button variant="default">Default</Button>
              <Button variant="secondary" class="bg-green-tone-ink hover:bg-shadow-moss text-white">Secondary</Button>
            </div>
          </div>
          
          <div>
            <p class="text-sm text-shadow-moss mb-2">Ghost Button</p>
            <div class="flex gap-4">
              <Button variant="ghost" class="text-shadow-moss hover:bg-speed-of-light">Ghost</Button>
              <Button variant="ghost" class="text-green-tone-ink hover:bg-speed-of-light">Ghost Colored</Button>
            </div>
          </div>
          
          <div>
            <p class="text-sm text-shadow-moss mb-2">Neumorphic Button</p>
            <button class="px-4 py-2 rounded bg-speed-of-light shadow-neumorph hover:shadow-neumorph-sm active:shadow-neumorph-pressed transition-all duration-200 text-shadow-moss">
              Neumorphic
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Glassmorphic Components -->
  <section class="mb-12" in:fade={{ duration: 300, delay: 400 }}>
    <h2 class="text-2xl font-semibold mb-6 text-shadow-moss">Glassmorphic Components</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Glass Panel -->
      <div class="glass-panel p-6 relative overflow-hidden">
        <div class="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-green-tone-ink/30 blur-xl"></div>
        <div class="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-good-as-gold/30 blur-xl"></div>
        
        <h3 class="text-lg font-medium mb-4 text-shadow-moss relative z-10">Glass Panel</h3>
        <p class="text-shadow-moss relative z-10">
          This is a glassmorphic panel with a backdrop blur effect. It creates a frosted glass appearance
          that allows background elements to show through with a blur.
        </p>
      </div>
      
      <!-- Glass Card -->
      <div class="glass-panel p-0 overflow-hidden">
        <div class="p-4 border-b border-white/20">
          <h3 class="text-lg font-medium text-shadow-moss">Glass Card</h3>
        </div>
        <div class="p-6">
          <p class="text-shadow-moss mb-4">
            A card component with glassmorphic styling, perfect for overlaying on colorful backgrounds.
          </p>
          <button class="px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm shadow-glass hover:bg-white/90 transition-all duration-200 text-shadow-moss">
            Glass Button
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- ToitTorus Component -->
  <section class="mb-12" in:fade={{ duration: 300, delay: 500 }}>
    <h2 class="text-2xl font-semibold mb-6 text-shadow-moss">ToitTorus Component</h2>
    
    <div class="glass-panel p-6">
      <div class="max-w-2xl mx-auto">
        <ToitTorus tasks={demoTasks} isPreview={true} />
      </div>
    </div>
  </section>

  <!-- Typography -->
  <section class="mb-12 neumorph-panel p-6" in:fade={{ duration: 300, delay: 600 }}>
    <h2 class="text-2xl font-semibold mb-6 text-shadow-moss">Typography</h2>
    
    <div class="space-y-6">
      <div>
        <h1 class="text-4xl font-bold text-shadow-moss">Heading 1</h1>
        <p class="text-sm text-shadow-moss mt-1">text-4xl font-bold</p>
      </div>
      
      <div>
        <h2 class="text-3xl font-semibold text-shadow-moss">Heading 2</h2>
        <p class="text-sm text-shadow-moss mt-1">text-3xl font-semibold</p>
      </div>
      
      <div>
        <h3 class="text-2xl font-medium text-shadow-moss">Heading 3</h3>
        <p class="text-sm text-shadow-moss mt-1">text-2xl font-medium</p>
      </div>
      
      <div>
        <h4 class="text-xl font-medium text-shadow-moss">Heading 4</h4>
        <p class="text-sm text-shadow-moss mt-1">text-xl font-medium</p>
      </div>
      
      <div>
        <p class="text-base text-shadow-moss">Regular paragraph text</p>
        <p class="text-sm text-shadow-moss mt-1">text-base</p>
      </div>
      
      <div>
        <p class="text-sm text-shadow-moss">Small text for secondary information</p>
        <p class="text-xs text-shadow-moss mt-1">text-sm</p>
      </div>
      
      <div>
        <p class="forestry-gradient-text text-2xl font-bold">Gradient Text</p>
        <p class="text-sm text-shadow-moss mt-1">forestry-gradient-text</p>
      </div>
    </div>
  </section>
</div> 