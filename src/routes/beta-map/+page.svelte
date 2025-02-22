<script lang="ts">
  import { enhance } from '$app/forms';
  import { user } from '$lib/stores/userStore';
  import { supabase } from '$lib/supabaseClient';
  import MindMap3D from '$lib/components/MindMap3D.svelte';
  import { Button } from "$lib/components/ui/button";
  import { Card } from "$lib/components/ui/card";
  import { page } from '$app/stores';

  export let data;

  let isProcessing = false;
  let error: string | null = null;
  let mindMapData = null;

  $: mindMapId = $page.url.searchParams.get('id');
  $: isAuthenticated = !!$user;

  function handleBack() {
    window.location.href = '/beta-app';
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
    <div class="relative bg-white rounded-lg shadow-[8px_8px_16px_rgba(0,0,0,0.05),-8px_-8px_16px_rgba(255,255,255,0.9)] p-4">
      <Button 
        variant="outline" 
        class="absolute top-4 left-4 z-10 bg-white shadow-[4px_4px_10px_rgba(0,0,0,0.05),-4px_-4px_10px_rgba(255,255,255,0.9)] hover:shadow-[2px_2px_5px_rgba(0,0,0,0.05),-2px_-2px_5px_rgba(255,255,255,0.9)] text-gray-700 border-none"
        on:click={handleBack}
      >
        Back to Tasks
      </Button>
      <div class="h-[80vh] w-full bg-gray-50 rounded-lg shadow-inner">
        <MindMap3D />
      </div>
    </div>
  </main>
</div>

<style>
  :global(body) {
    @apply bg-gray-50;
  }
</style> 