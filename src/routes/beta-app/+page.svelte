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

<div class="min-h-screen bg-gray-50">
  <header class="px-4 lg:px-6 h-14 flex items-center bg-white shadow-sm">
    <a class="flex items-center justify-center" href="/">
      <img src="/logo.jpg" alt="Toit logo" class="h-10 w-auto mr-2" />
      <span class="font-bold text-2xl text-gray-800">toit</span>
    </a>
    <nav class="ml-auto flex gap-4 sm:gap-6">
      {#if isAuthenticated}
        <Button variant="ghost" class="text-gray-600 hover:bg-gray-100">
          Logout
        </Button>
      {:else}
        <a href="/signup">
          <Button variant="secondary" class="bg-gray-100 hover:bg-gray-200 text-gray-700">Sign Up</Button>
        </a>
        <a href="/login">
          <Button variant="ghost" class="text-gray-600 hover:bg-gray-100">Login</Button>
        </a>
      {/if}
    </nav>
  </header>

  <main class="container mx-auto px-4 py-8">
    {#if isLoading}
      <div class="flex justify-center items-center h-[60vh]">
        <div class="text-gray-600 text-xl">Loading your mind maps...</div>
      </div>
    {:else}
      <div class="max-w-4xl mx-auto">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-2xl font-bold text-gray-800">Your Mind Maps</h1>
          <Button 
            on:click={() => isCreatingNew = true}
            class="bg-white shadow-[4px_4px_10px_rgba(0,0,0,0.05),-4px_-4px_10px_rgba(255,255,255,0.9)] hover:shadow-[2px_2px_5px_rgba(0,0,0,0.05),-2px_-2px_5px_rgba(255,255,255,0.9)] text-gray-700"
          >
            Create New Map
          </Button>
        </div>

        {#if isCreatingNew}
          <div class="bg-white rounded-lg p-6 mb-8 shadow-[8px_8px_16px_rgba(0,0,0,0.05),-8px_-8px_16px_rgba(255,255,255,0.9)]">
            <h2 class="text-xl font-bold mb-4 text-gray-800">Create New Mind Map</h2>
            <form on:submit={handleSubmit} class="space-y-4">
              <div>
                <textarea
                  bind:value={currentTask}
                  placeholder="Describe your task..."
                  rows="4"
                  class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent shadow-inner"
                  disabled={isProcessing}
                ></textarea>
              </div>
              <div class="flex gap-4">
                <Button 
                  type="submit" 
                  disabled={isProcessing}
                  class="flex-1 bg-white shadow-[4px_4px_10px_rgba(0,0,0,0.05),-4px_-4px_10px_rgba(255,255,255,0.9)] hover:shadow-[2px_2px_5px_rgba(0,0,0,0.05),-2px_-2px_5px_rgba(255,255,255,0.9)] text-gray-700"
                >
                  {isProcessing ? 'Processing...' : 'Create Mind Map'}
                </Button>
                <Button 
                  variant="outline" 
                  type="button" 
                  on:click={() => isCreatingNew = false}
                  class="border-gray-200 text-gray-600 hover:bg-gray-50"
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
          {#each mindMaps as map}
            <div 
              class="bg-white p-6 rounded-lg cursor-pointer transition-all duration-200 shadow-[8px_8px_16px_rgba(0,0,0,0.05),-8px_-8px_16px_rgba(255,255,255,0.9)] hover:shadow-[4px_4px_8px_rgba(0,0,0,0.05),-4px_-4px_8px_rgba(255,255,255,0.9)]"
              on:click={() => handleExistingMap(map.mindmap_id)}
            >
              <h3 class="text-lg font-semibold text-gray-800">{map.name}</h3>
              <p class="text-sm text-gray-500">{map.description}</p>
              <div class="flex justify-between items-center mt-4">
                <span class="text-xs text-gray-400">Created: {new Date(map.created_at).toLocaleDateString()}</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  class="text-gray-600 hover:bg-gray-50"
                >
                  Open Map
                </Button>
              </div>
            </div>
          {/each}
        </div>

        {#if mindMaps.length === 0 && !isCreatingNew}
          <div class="bg-white p-6 rounded-lg text-center shadow-[8px_8px_16px_rgba(0,0,0,0.05),-8px_-8px_16px_rgba(255,255,255,0.9)]">
            <p class="text-gray-500 mb-4">No mind maps yet. Create your first one!</p>
            <Button 
              on:click={() => isCreatingNew = true}
              class="bg-white shadow-[4px_4px_10px_rgba(0,0,0,0.05),-4px_-4px_10px_rgba(255,255,255,0.9)] hover:shadow-[2px_2px_5px_rgba(0,0,0,0.05),-2px_-2px_5px_rgba(255,255,255,0.9)] text-gray-700"
            >
              Create Mind Map
            </Button>
          </div>
        {/if}
      </div>
    {/if}
  </main>
</div>

<style>
  :global(body) {
    @apply bg-gray-50;
  }
</style> 