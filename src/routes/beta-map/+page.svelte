<script lang="ts">
  import { enhance } from '$app/forms';
  import { user } from '$lib/stores/userStore';
  import { supabase } from '$lib/supabaseClient';
  import { getMindMapById } from '$lib/supabaseClient';
  import { nodes, initializeNodes } from '$lib/stores/mindMapStore';
  import MindMap3D from '$lib/components/MindMap3D.svelte';
  import { Button } from "$lib/components/ui/button";
  import { Card } from "$lib/components/ui/card";
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { fade, fly } from 'svelte/transition';
  import { onMount } from 'svelte';
  import type { MindMapNode, NodeType } from '$lib/types/mindmap';

  export let data;

  let isProcessing = false;
  let error: string | null = null;
  let mindMapData: any = null;
  let mindMapComponent: MindMap3D;

  interface DBMindMapNode {
    node_id: number;
    content: string;
    x: number;
    y: number;
    z: number;
    parent_node_id: number | null;
    node_type: string;
  }

  $: mindMapId = $page.url.searchParams.get('id');
  $: isAuthenticated = !!$user;

  onMount(async () => {
    if (mindMapId) {
      try {
        isProcessing = true;
        // Load mind map data
        const mapData = await getMindMapById(parseInt(mindMapId));
        mindMapData = mapData;
        
        // Transform nodes for the store
        const mappedNodes: MindMapNode[] = mapData.mindmap_nodes.map((node: DBMindMapNode) => {
          return {
            id: node.node_id,
            label: node.content || '',
            title: node.content || '',
            description: '', // Default empty description
            x: node.x || 0,
            y: node.y || 0,
            z: node.z || 0,
            type: node.node_type === 'concept' ? 'center' : 'main' as 'center' | 'main',
            nodeType: node.node_type as NodeType,
            parentId: node.parent_node_id,
            color: node.node_type === 'concept' ? '#4CAF50' : '#2196F3',
            isCenter: node.node_type === 'concept',
            status: 'pending',
            priority: 3,
            estimatedDuration: 0,
            tags: []
          };
        });
        
        // Initialize the store with the nodes
        initializeNodes(mappedNodes);
        
        // Wait for the component to be ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Initialize the 3D visualization
        if (mindMapComponent) {
          mindMapComponent.initializeNodesFromStore(mappedNodes);
        }
      } catch (e) {
        console.error('Error loading mind map:', e);
        error = e instanceof Error ? e.message : 'Failed to load mind map';
      } finally {
        isProcessing = false;
      }
    }
  });

  function handleBack() {
    goto('/beta-app');
  }
</script>

<div class="min-h-screen bg-speed-of-light">
  <main class="container mx-auto px-4 py-8">
    <div class="relative glass-panel p-4" in:fade={{ duration: 300 }}>
      <Button 
        variant="ghost" 
        class="absolute top-4 left-4 z-10 btn-ghost"
        on:click={handleBack}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        Back
      </Button>
      
      {#if mindMapData}
        <h2 class="text-xl font-semibold mb-4 text-center mt-12">{mindMapData.name}</h2>
      {/if}
      
      {#if isProcessing}
        <div class="flex justify-center items-center h-[60vh]">
          <div class="neumorph-panel p-8 text-center" in:fade>
            <div class="animate-pulse flex flex-col items-center">
              <div class="h-12 w-12 rounded-full bg-neugray-200 mb-4"></div>
              <div class="h-4 w-48 bg-neugray-200 rounded mb-2"></div>
              <div class="h-3 w-32 bg-neugray-200 rounded"></div>
            </div>
          </div>
        </div>
      {:else if error}
        <div class="flex justify-center items-center h-[60vh]">
          <div class="neumorph-panel p-8 text-center" in:fade>
            <p class="text-red-500">{error}</p>
            <Button class="mt-4" on:click={handleBack}>Return to Mind Maps</Button>
          </div>
        </div>
      {:else}
        <div class="h-[80vh] w-full mt-12">
          <MindMap3D bind:this={mindMapComponent} />
        </div>
      {/if}
    </div>
  </main>
</div>

<style>
  /* Removing this override to allow the global theme to work properly */
  /* :global(body) {
    @apply bg-gray-50;
  } */
</style> 