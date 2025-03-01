<script lang="ts">
  import { enhance } from '$app/forms';
  import { user } from '$lib/stores/userStore';
  import { supabase } from '$lib/supabaseClient';
  import { Button } from "$lib/components/ui/button";
  import { Card } from "$lib/components/ui/card";
  import { goto } from '$app/navigation';
  import { getMindMaps, createMindMap } from '$lib/supabaseClient';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { fade, fly } from 'svelte/transition';

  export let data;

  let currentTask = '';
  let isProcessing = false;
  let error: string | null = null;
  let mindMaps: any[] = [];
  let isCreatingNew = false;
  let isLoading = true;

  $: isAuthenticated = !!$user;

  onMount(async () => {
    if (browser) {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (!session) {
          console.log('No session found, redirecting to login');
          goto('/login?redirectTo=/beta-app');
          return;
        }
        
        if (!$user && session.user) {
          $user = session.user;
        }
        
        await loadMindMaps();
      } catch (error) {
        console.error('Auth check error:', error);
        error = 'Authentication failed';
      } finally {
        isLoading = false;
      }
    }
  });

  async function loadMindMaps() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        error = 'No active session';
        return;
      }

      const maps = await getMindMaps();
      console.log('Loaded mind maps:', maps);
      mindMaps = maps;
    } catch (e) {
      console.error('Error loading mind maps:', e);
      error = 'Failed to load mind maps';
    }
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    isProcessing = true;
    error = null;

    try {
      // TODO: Implement AI task splitting
      const result = await createMindMap(
        currentTask.split('\n')[0] || 'New Task',
        currentTask,
        []
      );

      goto(`/beta-map?id=${result.mindmap_id}`);
    } catch (e) {
      error = e instanceof Error ? e.message : 'An error occurred';
      console.error('Task processing error:', e);
    } finally {
      isProcessing = false;
    }
  }

  function handleExistingMap(id: number) {
    goto(`/beta-map?id=${id}`);
  }
</script>

<div class="min-h-screen bg-speed-of-light">
  <main class="container mx-auto px-4 py-8">
    {#if isLoading}
      <div class="flex justify-center items-center h-[60vh]">
        <div class="neumorph-panel p-8 text-center" in:fade>
          <div class="animate-pulse flex flex-col items-center">
            <div class="h-12 w-12 rounded-full bg-neugray-200 mb-4"></div>
            <div class="h-4 w-48 bg-neugray-200 rounded mb-2"></div>
            <div class="h-3 w-32 bg-neugray-200 rounded"></div>
          </div>
        </div>
      </div>
    {:else}
      <div class="max-w-4xl mx-auto">
        <div class="flex justify-between items-center mb-8" in:fade={{ duration: 300 }}>
          <h1 class="text-2xl font-bold forestry-gradient-text">Your Mind Maps</h1>
          <Button 
            on:click={() => isCreatingNew = true}
            class="btn-primary"
          >
            Create New Map
          </Button>
        </div>

        {#if isCreatingNew}
          <div class="glass-panel mb-8" in:fade={{ duration: 300 }}>
            <h2 class="text-xl font-semibold mb-4 text-shadow-moss">Create New Mind Map</h2>
            <form on:submit={handleSubmit} class="space-y-4">
              <div>
                <textarea
                  bind:value={currentTask}
                  placeholder="Describe your task..."
                  rows="4"
                  class="input-field"
                  disabled={isProcessing}
                ></textarea>
              </div>
              <div class="flex gap-4">
                <Button 
                  type="submit" 
                  disabled={isProcessing}
                  class="btn-primary flex-1"
                >
                  {isProcessing ? 'Processing...' : 'Create Mind Map'}
                </Button>
                <Button 
                  variant="ghost" 
                  type="button" 
                  on:click={() => isCreatingNew = false}
                  class="btn-ghost flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
            {#if error}
              <p class="mt-4 text-red-400">{error}</p>
            {/if}
          </div>
        {/if}

        <div class="grid gap-4">
          {#each mindMaps as map, i}
            <div 
              class="neumorph-panel cursor-pointer transition-all duration-200 hover:-translate-y-1"
              on:click={() => handleExistingMap(map.mindmap_id)}
              in:fly={{ y: 20, delay: i * 50, duration: 300 }}
            >
              <h3 class="text-lg font-semibold text-shadow-moss">{map.name}</h3>
              <p class="text-sm text-shadow-moss opacity-80">{map.description}</p>
              <div class="flex justify-between items-center mt-4">
                <span class="text-xs text-shadow-moss opacity-60">Created: {new Date(map.created_at).toLocaleDateString()}</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  class="btn-ghost"
                >
                  Open Map
                </Button>
              </div>
            </div>
          {/each}
        </div>

        {#if mindMaps.length === 0 && !isCreatingNew}
          <div class="glass-panel text-center" in:fade={{ duration: 300 }}>
            <p class="text-shadow-moss mb-4">No mind maps yet. Create your first one!</p>
            <Button 
              on:click={() => isCreatingNew = true}
              class="btn-primary"
            >
              Create Mind Map
            </Button>
          </div>
        {/if}
      </div>
    {/if}
  </main>
</div> 