<script lang="ts">
  import MindMap3D from '$lib/components/MindMap3D.svelte';
  import NodeTable from '$lib/components/nodetable.svelte';
  import { onMount, tick } from 'svelte';
  import { nodes } from '$lib/stores/mindMapStore';
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { user } from '$lib/stores/userStore';
  import type { ActionResult } from '@sveltejs/kit';
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import { supabase } from '$lib/supabaseClient';
  import { getMindMaps, createMindMap, updateMindMap } from '$lib/supabaseClient';

  export let data;

  let mindMapComponent: MindMap3D;
  let formError = '';
  let formSuccess = false;
  let isLoading = true;
  let isInitializing = true;
  let hasInitialized = false;
  let authChecked = false;
  let mindMaps = [];
  let selectedMindMapId: number | null = null;
  let isCreatingNew = false;
  let newMapName = '';
  let newMapDescription = '';

  $: isAuthenticated = browser && (data.session?.user || $user);
  $: pageError = $page.error;
  $: if (mindMapComponent && $nodes.length > 0 && !isInitializing) {
    mindMapComponent.initializeNodesFromStore($nodes);
  }

  async function checkAuth() {
    if (browser) {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (!session) {
          console.log('No session found, redirecting to login');
          goto('/login?redirectTo=/maps');
          return false;
        }
        
        if (!$user && session.user) {
          $user = session.user;
        }
        
        return true;
      } catch (error) {
        console.error('Auth check error:', error);
        return false;
      } finally {
        authChecked = true;
        isLoading = false;
      }
    }
    return false;
  }

  onMount(async () => {
    if (browser) {
      const isAuthed = await checkAuth();
      if (!isAuthed) return;

      await tick();
      
      try {
        if (mindMapComponent && !hasInitialized) {
          console.log('Initializing mind map component');
          if ($nodes.length === 0) {
            mindMapComponent.createInitialNodes();
          } else {
            mindMapComponent.initializeNodesFromStore($nodes);
          }
          hasInitialized = true;
        }
      } catch (error) {
        console.error('Error initializing mind map:', error);
      } finally {
        isInitializing = false;
      }
    }
  });

  const handleSubmit = () => {
    return async ({ result, update }: { result: ActionResult, update: () => Promise<void> }) => {
      await update();
      
      if (result.type === 'failure') {
        formError = result.data?.message || 'Failed to save mind map';
        formSuccess = false;
        
        if (result.status === 401) {
          goto('/login?redirectTo=/maps');
        }
        
        console.error('Form submission error:', result.data);
      } else {
        formError = '';
        formSuccess = true;
        console.log('Form submission successful:', result);
      }
    };
  };

  function handleAddNode() {
    if (mindMapComponent) {
      const x = Math.random() * 6 - 3;
      const y = Math.random() * 6 - 3;
      const z = Math.random() * 2 - 1;
      mindMapComponent.addNode(x, y, z);
    }
  }

  onMount(async () => {
    if (browser) {
      const isAuthed = await checkAuth();
      if (!isAuthed) return;

      try {
        mindMaps = await getMindMaps();
      } catch (error) {
        console.error('Error loading mind maps:', error);
      }
    }
  });

  function handleNewMap() {
    isCreatingNew = true;
    selectedMindMapId = null;
    newMapName = '';
    newMapDescription = '';
    
    if (mindMapComponent) {
      mindMapComponent.createInitialNodes();
    }
  }

  async function handleMindMapSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    const value = select.value;
    
    if (value === 'new') {
      handleNewMap();
      return;
    }
    
    isCreatingNew = false;
    selectedMindMapId = parseInt(value);
    
    const selectedMap = mindMaps.find(map => map.mindmap_id === selectedMindMapId);
    if (selectedMap && mindMapComponent) {
      newMapName = selectedMap.name;
      newMapDescription = selectedMap.description;
      
      const mappedNodes = selectedMap.mindmap_nodes.map(node => ({
        id: node.node_id,
        x: node.x,
        y: node.y,
        z: node.z,
        isCenter: node.node_type === 'concept'
      }));
      
      nodes.set(mappedNodes);
      mindMapComponent.initializeNodesFromStore(mappedNodes);
    }
  }

  async function handleSaveMindMap() {
    try {
      if (isCreatingNew) {
        const result = await createMindMap(newMapName, newMapDescription, $nodes);
        mindMaps = [...mindMaps, result];
        selectedMindMapId = result.mindmap_id;
        isCreatingNew = false;
      } else {
        const result = await updateMindMap(selectedMindMapId!, newMapName, newMapDescription, $nodes);
        mindMaps = mindMaps.map(map => 
          map.mindmap_id === selectedMindMapId ? result : map
        );
      }
      
      formSuccess = true;
      formError = '';
    } catch (error) {
      console.error('Error saving mind map:', error);
      formError = 'Failed to save mind map';
      formSuccess = false;
    }
  }
</script>

{#if isLoading}
  <div class="flex justify-center items-center h-screen">
    <div class="text-white text-xl">Loading...</div>
  </div>
{:else if pageError}
  <div class="text-center p-8 bg-red-100 rounded-lg max-w-md mx-auto">
    <h1 class="text-red-600 mb-4">Error</h1>
    <p class="text-white mb-4">{pageError.message}</p>
    <a href="/login?redirectTo=/maps" class="btn-primary">Return to Login</a>
  </div>
{:else if !isAuthenticated}
  <div class="text-center p-8 bg-gray-100 rounded-lg max-w-md mx-auto">
    <p class="text-white mb-4">Please log in to access this page</p>
    <a href="/login?redirectTo=/maps" class="btn-primary">Log In</a>
  </div>
{:else}
  <div class="container mx-auto px-4">
    <h1 class="text-4xl text-white text-center mb-8">Toit Mind Map</h1>

    <nav class="mb-8">
      <a href="/" class="btn-primary">Back to Home</a>
    </nav>

    <div class="glass-panel mb-8">
      <div class="flex gap-4 mb-4">
        <select 
          class="input-field flex-1"
          on:change={handleMindMapSelect}
          value={selectedMindMapId || ''}
        >
          <option value="">Select a mind map</option>
          <option value="new">Create New Mind Map</option>
          {#each mindMaps as map}
            <option value={map.mindmap_id}>{map.name}</option>
          {/each}
        </select>
      </div>

      <form 
        on:submit|preventDefault={handleSaveMindMap}
        class="space-y-4"
      >
        <div>
          <label for="map_name" class="block text-white mb-2">Mind Map Name</label>
          <input 
            type="text" 
            id="map_name" 
            bind:value={newMapName}
            required 
            class="input-field"
          >
        </div>
        <div>
          <label for="map_description" class="block text-white mb-2">Description</label>
          <textarea 
            id="map_description" 
            bind:value={newMapDescription}
            class="input-field"
          ></textarea>
        </div>
        <button type="submit" class="btn-primary w-full">
          {isCreatingNew ? 'Create New Mind Map' : 'Update Mind Map'}
        </button>
      </form>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="col-span-2">
        <MindMap3D bind:this={mindMapComponent} />
      </div>
      <div class="flex flex-col gap-4">
        <button on:click={handleAddNode} class="btn-secondary">Add Node</button>
        <NodeTable nodes={$nodes} />
      </div>
    </div>
  </div>
{/if}