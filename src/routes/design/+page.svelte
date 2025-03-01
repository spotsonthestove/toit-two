<!-- Design System Showcase Page -->
<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { Button } from "$lib/components/ui/button";
  import ToitTorus from '$lib/components/ToitTorus.svelte';
  import { onMount } from 'svelte';

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

  // Interactive demo states
  let activeTab = 'components';
  let hoverState = false;
  let pressedState = false;
  let selectedColor = forestryColors[0];

  // Animation demo
  let showAnimation = false;
  function triggerAnimation() {
    showAnimation = true;
    setTimeout(() => {
      showAnimation = false;
    }, 2000);
  }

  // Form demo
  let demoName = '';
  let demoEmail = '';
  let demoMessage = '';
  let formSubmitted = false;

  function handleFormSubmit() {
    formSubmitted = true;
    setTimeout(() => {
      demoName = '';
      demoEmail = '';
      demoMessage = '';
      formSubmitted = false;
    }, 3000);
  }
</script>

<svelte:head>
  <title>Toit Design System</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="mb-8" in:fade={{ duration: 300, delay: 100 }}>
    <h1 class="text-3xl font-bold forestry-gradient-text mb-2">Toit Design System</h1>
    <p class="text-shadow-moss">UIDF V2: A showcase of neumorphic and glassmorphic UI components with forestry colors</p>
  </div>

  <!-- Navigation Tabs -->
  <div class="neumorph-panel mb-8 p-2" in:fade={{ duration: 300, delay: 150 }}>
    <div class="flex">
      <button 
        class="flex-1 py-3 px-4 rounded-lg transition-all duration-200 text-shadow-moss {activeTab === 'components' ? 'neumorph-pressed' : 'hover:bg-speed-of-light/50'}"
        on:click={() => activeTab = 'components'}
      >
        Components
      </button>
      <button 
        class="flex-1 py-3 px-4 rounded-lg transition-all duration-200 text-shadow-moss {activeTab === 'colors' ? 'neumorph-pressed' : 'hover:bg-speed-of-light/50'}"
        on:click={() => activeTab = 'colors'}
      >
        Colors
      </button>
      <button 
        class="flex-1 py-3 px-4 rounded-lg transition-all duration-200 text-shadow-moss {activeTab === 'typography' ? 'neumorph-pressed' : 'hover:bg-speed-of-light/50'}"
        on:click={() => activeTab = 'typography'}
      >
        Typography
      </button>
      <button 
        class="flex-1 py-3 px-4 rounded-lg transition-all duration-200 text-shadow-moss {activeTab === 'animations' ? 'neumorph-pressed' : 'hover:bg-speed-of-light/50'}"
        on:click={() => activeTab = 'animations'}
      >
        Animations
      </button>
    </div>
  </div>

  {#if activeTab === 'colors'}
    <!-- Color Palette -->
    <section class="mb-12 glass-panel p-6" in:fade={{ duration: 300 }}>
      <h2 class="text-2xl font-semibold mb-6 text-shadow-moss">Forestry Color Palette</h2>
      
      <div class="mb-8">
        <h3 class="text-lg font-medium mb-4 text-shadow-moss">Primary Colors</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {#each forestryColors as color, i}
            <div 
              class="aspect-square rounded-lg flex flex-col items-center justify-center {color.class} {color.text} cursor-pointer transition-all duration-200 hover:scale-105"
              in:fly={{ y: 20, delay: i * 50, duration: 300 }}
              on:click={() => selectedColor = color}
              class:ring-4={selectedColor === color}
              class:ring-white={selectedColor === color}
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

      <div class="mt-8 p-6 rounded-lg {selectedColor.class} {selectedColor.text} transition-all duration-300">
        <h3 class="text-xl font-semibold mb-2">Selected Color: {selectedColor.name}</h3>
        <p>This panel demonstrates how the selected color looks when applied as a background.</p>
        <div class="mt-4 flex gap-2">
          <button class="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all duration-200">
            Light Button
          </button>
          <button class="px-4 py-2 bg-black/20 backdrop-blur-sm rounded-lg hover:bg-black/30 transition-all duration-200">
            Dark Button
          </button>
        </div>
      </div>
    </section>
  {:else if activeTab === 'typography'}
    <!-- Typography -->
    <section class="mb-12 neumorph-panel p-6" in:fade={{ duration: 300 }}>
      <h2 class="text-2xl font-semibold mb-6 text-shadow-moss">Typography</h2>
      
      <div class="space-y-6">
        <div>
          <h1 class="text-4xl font-bold forestry-gradient-text">Heading 1 with Gradient</h1>
          <p class="text-sm text-shadow-moss mt-1">text-4xl font-bold forestry-gradient-text</p>
        </div>
        
        <div>
          <h1 class="text-4xl font-bold text-shadow-moss">Heading 1</h1>
          <p class="text-sm text-shadow-moss mt-1">text-4xl font-bold text-shadow-moss</p>
        </div>
        
        <div>
          <h2 class="text-3xl font-semibold text-shadow-moss">Heading 2</h2>
          <p class="text-sm text-shadow-moss mt-1">text-3xl font-semibold text-shadow-moss</p>
        </div>
        
        <div>
          <h3 class="text-2xl font-medium text-shadow-moss">Heading 3</h3>
          <p class="text-sm text-shadow-moss mt-1">text-2xl font-medium text-shadow-moss</p>
        </div>
        
        <div>
          <h4 class="text-xl font-medium text-shadow-moss">Heading 4</h4>
          <p class="text-sm text-shadow-moss mt-1">text-xl font-medium text-shadow-moss</p>
        </div>
        
        <div>
          <p class="text-base text-shadow-moss">Body text in shadow moss color. This is the standard paragraph style used throughout the application.</p>
          <p class="text-sm text-shadow-moss mt-1">text-base text-shadow-moss</p>
        </div>
        
        <div>
          <p class="text-sm text-shadow-moss opacity-80">Small text with reduced opacity for secondary information.</p>
          <p class="text-xs text-shadow-moss mt-1">text-sm text-shadow-moss opacity-80</p>
        </div>
      </div>
    </section>
  {:else if activeTab === 'animations'}
    <!-- Animations -->
    <section class="mb-12" in:fade={{ duration: 300 }}>
      <h2 class="text-2xl font-semibold mb-6 text-shadow-moss">Animations & Transitions</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Hover & Press States -->
        <div class="neumorph-panel p-6">
          <h3 class="text-lg font-medium mb-4 text-shadow-moss">Interactive States</h3>
          
          <div class="space-y-6">
            <div>
              <p class="text-sm text-shadow-moss mb-2">Hover Effect</p>
              <div 
                class="neumorph-panel-sm p-4 transition-all duration-200 {hoverState ? 'shadow-neumorph-hover -translate-y-1' : ''}"
                on:mouseenter={() => hoverState = true}
                on:mouseleave={() => hoverState = false}
              >
                <p class="text-shadow-moss">Hover over me</p>
              </div>
            </div>
            
            <div>
              <p class="text-sm text-shadow-moss mb-2">Pressed Effect</p>
              <div 
                class="neumorph-panel-sm p-4 transition-all duration-200 {pressedState ? 'shadow-neumorph-pressed' : ''}"
                on:mousedown={() => pressedState = true}
                on:mouseup={() => pressedState = false}
                on:mouseleave={() => pressedState = false}
              >
                <p class="text-shadow-moss">Press and hold me</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Animation Demo -->
        <div class="glass-panel p-6 relative overflow-hidden">
          <h3 class="text-lg font-medium mb-4 text-shadow-moss">Animation Demo</h3>
          
          <div class="flex flex-col items-center">
            <div class="relative w-32 h-32 mb-4">
              {#if showAnimation}
                <div 
                  class="absolute inset-0 bg-green-tone-ink rounded-full"
                  in:fly={{ y: 50, duration: 500 }}
                  out:fade={{ duration: 300 }}
                ></div>
                <div 
                  class="absolute inset-4 bg-good-as-gold rounded-full"
                  in:fly={{ y: 50, duration: 500, delay: 100 }}
                  out:fade={{ duration: 300, delay: 100 }}
                ></div>
                <div 
                  class="absolute inset-8 bg-walnut-shell rounded-full"
                  in:fly={{ y: 50, duration: 500, delay: 200 }}
                  out:fade={{ duration: 300, delay: 200 }}
                ></div>
                <div 
                  class="absolute inset-12 bg-shadow-moss rounded-full"
                  in:fly={{ y: 50, duration: 500, delay: 300 }}
                  out:fade={{ duration: 300, delay: 300 }}
                ></div>
              {:else}
                <div class="absolute inset-0 bg-speed-of-light rounded-full shadow-neumorph flex items-center justify-center">
                  <span class="text-shadow-moss">Click button</span>
                </div>
              {/if}
            </div>
            
            <Button on:click={triggerAnimation} class="btn-primary">
              Trigger Animation
            </Button>
          </div>
        </div>
      </div>
    </section>
  {:else}
    <!-- Neumorphic Components -->
    <section class="mb-12" in:fade={{ duration: 300 }}>
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
                <button class="btn-primary">Primary</button>
                <button class="btn-secondary">Secondary</button>
              </div>
            </div>
            
            <div>
              <p class="text-sm text-shadow-moss mb-2">Ghost Button</p>
              <div class="flex gap-4">
                <button class="btn-ghost">Ghost</button>
                <button class="btn-ghost text-green-tone-ink">Ghost Colored</button>
              </div>
            </div>
            
            <div>
              <p class="text-sm text-shadow-moss mb-2">Button States</p>
              <div class="flex gap-4">
                <button class="btn-primary opacity-50">Disabled</button>
                <button class="btn-primary shadow-neumorph-pressed">Pressed</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Glassmorphic Components -->
    <section class="mb-12" in:fade={{ duration: 300 }}>
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
        
        <!-- Glass Form -->
        <div class="glass-panel p-0 overflow-hidden">
          <div class="p-4 border-b border-white/20">
            <h3 class="text-lg font-medium text-shadow-moss">Contact Form</h3>
          </div>
          <div class="p-6">
            {#if formSubmitted}
              <div class="p-4 bg-green-tone-ink/20 rounded-lg text-shadow-moss mb-4" in:fly={{ y: 20, duration: 300 }}>
                Thank you for your submission!
              </div>
            {/if}
            <form on:submit|preventDefault={handleFormSubmit} class="space-y-4">
              <div>
                <label class="block text-shadow-moss mb-2 text-sm">Name</label>
                <input type="text" bind:value={demoName} class="input-field" required />
              </div>
              <div>
                <label class="block text-shadow-moss mb-2 text-sm">Email</label>
                <input type="email" bind:value={demoEmail} class="input-field" required />
              </div>
              <div>
                <label class="block text-shadow-moss mb-2 text-sm">Message</label>
                <textarea bind:value={demoMessage} rows="3" class="input-field" required></textarea>
              </div>
              <button type="submit" class="btn-primary w-full">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- ToitTorus Component -->
    <section class="mb-12" in:fade={{ duration: 300 }}>
      <h2 class="text-2xl font-semibold mb-6 text-shadow-moss">ToitTorus Component</h2>
      
      <div class="glass-panel p-6">
        <div class="max-w-2xl mx-auto">
          <ToitTorus tasks={demoTasks} isPreview={true} />
        </div>
      </div>
    </section>
  {/if}

  <!-- Footer -->
  <footer class="text-center text-shadow-moss text-sm mt-12 opacity-70">
    <p>Toit Design System - UIDF V2 Implementation</p>
  </footer>
</div> 