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
  import NodeDataForm from '$lib/components/NodeDataForm.svelte';
  import * as THREE from 'three';
  import type { MindMapNode, NodeType } from '$lib/types/mindmap';

  // This interface is causing conflicts with DOM Node type
  // Rename to MapNode to avoid conflicts
  interface MapNode {
    id: number;
    title: string;
    description: string;
    x: number;
    y: number;
    z: number;
    nodeType: NodeType;
    parentId: number | null;
    isCenter: boolean;
  }

  interface DBMindMapNode {
    node_id: number;
    title: string;
    description: string;
    content: string;
    x: number;
    y: number;
    z: number;
    node_type: NodeType;
    parent_node_id: number | null;
  }

  interface DBMindMap {
    mindmap_id: number;
    name: string;
    description: string;
    created_at: string;
    mindmap_nodes: DBMindMapNode[];
  }

  interface MindMap {
    mindmap_id: number;
    name: string;
    description: string;
    mindmap_nodes: DBMindMapNode[];
  }

  export let data;

  let mindMapComponent: MindMap3D;
  let formError = '';
  let formSuccess = false;
  let isLoading = true;
  let isInitializing = true;
  let hasInitialized = false;
  let authChecked = false;
  let mindMaps: MindMap[] = [];
  let selectedMindMapId: number | null = null;
  let isCreatingNew = false;
  let newMapName = '';
  let newMapDescription = '';
  let selectedNodeId: number | null = null;
  let selectedNodePosition: { x: number; y: number; z: number } | null = null;

  $: isAuthenticated = browser && (data.session?.user || $user);
  $: pageError = $page.error;

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

      try {
        const rawMindMaps = await getMindMaps();
        mindMaps = rawMindMaps.map(map => ({
          mindmap_id: map.mindmap_id,
          name: map.name,
          description: map.description,
          mindmap_nodes: map.mindmap_nodes.map(node => ({
            node_id: node.node_id,
            title: node.content || 'New Node',
            description: '',
            content: node.content || '',
            x: node.x,
            y: node.y,
            z: node.z,
            node_type: node.node_type as NodeType,
            parent_node_id: node.parent_node_id
          }))
        }));
      } catch (error) {
        console.error('Error loading mind maps:', error);
      }
    }
  });

  async function handleNewMap() {
    isCreatingNew = true;
    selectedMindMapId = null;
    newMapName = '';
    newMapDescription = '';
    
    nodes.set([]);
    
    if (mindMapComponent) {
        await tick();
        mindMapComponent.clearScene();
    }
  }

  async function handleSaveMindMap() {
    try {
        if (!newMapName) {
            formError = 'Please enter a map name';
            return;
        }

        if (isCreatingNew) {
            const initialNodes: MindMapNode[] = [
                {
                    id: 1,
                    label: 'Central Idea',
                    title: 'Central Idea',
                    description: 'Click to edit',
                    x: 0,
                    y: 0,
                    z: 0,
                    type: 'center',
                    nodeType: 'concept',
                    parentId: null,
                    color: '#4CAF50',
                    isCenter: true
                }
            ];

            const result = await createMindMap(
                newMapName,
                newMapDescription || 'Description',
                initialNodes as any
            );

            mindMaps = [...mindMaps, {
                mindmap_id: result.mindmap_id,
                name: result.name,
                description: result.description,
                mindmap_nodes: result.nodes
            }];
            
            selectedMindMapId = result.mindmap_id;
            isCreatingNew = false;

            const mappedNodes = result.nodes.map((node: any) => ({
                id: node.node_id,
                label: node.title,
                title: node.title,
                description: node.description,
                x: node.x,
                y: node.y,
                z: node.z,
                type: node.node_type === 'concept' ? 'center' : 'main',
                nodeType: node.node_type,
                parentId: node.parent_node_id,
                color: node.node_type === 'concept' ? '#4CAF50' : '#2196F3',
                isCenter: node.node_type === 'concept'
            }));

            nodes.set(mappedNodes);
            
            if (mindMapComponent) {
                await tick();
                mindMapComponent.initializeNodesFromStore(mappedNodes);
            }
        } else {
            const formattedNodes = $nodes.map(node => ({
                id: node.id,
                title: node.title,
                description: node.description,
                x: node.x,
                y: node.y,
                z: node.z,
                nodeType: node.nodeType,
                parentId: node.parentId,
                isCenter: node.isCenter
            }));

            const result = await updateMindMap(
                selectedMindMapId!,
                newMapName,
                newMapDescription,
                formattedNodes as any
            );
            
            mindMaps = mindMaps.map(map => 
                map.mindmap_id === selectedMindMapId ? result : map
            );
        }

        formSuccess = true;
        setTimeout(() => formSuccess = false, 3000);
    } catch (error) {
        console.error('Error saving mind map:', error);
        formError = 'Failed to save mind map';
        setTimeout(() => formError = '', 3000);
    }
  }

  function handleNodeSelect(event: CustomEvent) {
    const { nodeId, position, nodeData } = event.detail;
    selectedNodeId = nodeId;
    selectedNodePosition = position;
  }

  function handleFormSave(event: CustomEvent) {
    const nodeData = event.detail;
    if (selectedNodeId !== null && mindMapComponent) {
        mindMapComponent.updateNode(nodeData);
        
        nodes.update(currentNodes => 
            currentNodes.map(node => 
                node.id === selectedNodeId
                    ? { ...node, ...nodeData }
                    : node
            )
        );
        
        selectedNodeId = null;
        selectedNodePosition = null;
    }
  }

  async function handleMindMapSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    const value = select.value;
    
    if (!value) return;
    
    try {
        isCreatingNew = false;
        selectedMindMapId = parseInt(value);
        
        const selectedMap = mindMaps.find(map => map.mindmap_id === selectedMindMapId);
        if (selectedMap && mindMapComponent) {
            newMapName = selectedMap.name;
            newMapDescription = selectedMap.description;
            
            const mappedNodes: MindMapNode[] = selectedMap.mindmap_nodes.map(node => ({
                id: node.node_id,
                label: node.title,
                title: node.title,
                description: node.description,
                x: node.x,
                y: node.y,
                z: node.z,
                type: node.node_type === 'concept' ? 'center' : 'main',
                nodeType: node.node_type,
                parentId: node.parent_node_id,
                color: node.node_type === 'concept' ? '#4CAF50' : '#2196F3',
                isCenter: node.node_type === 'concept'
            }));
            
            nodes.set(mappedNodes);
            
            await tick();
            
            mindMapComponent.initializeNodesFromStore(mappedNodes);
        }
    } catch (error) {
        console.error('Error selecting mind map:', error);
        formError = 'Failed to load selected mind map';
    }
  }

  async function handleAddNode() {
    if (!mindMapComponent || !selectedMindMapId) return;
    
    const centerNode = $nodes.find(node => node.isCenter);
    if (!centerNode) return;
    
    try {
        // First, create the node in the database
        const { data: mindmapNodes, error } = await supabase
            .from('mindmap_nodes')
            .insert({
                mindmap_id: selectedMindMapId,
                parent_node_id: centerNode.id,
                content: 'New Node',
                title: 'New Node',
                description: 'Click to edit',
                x: Math.cos(Math.random() * Math.PI * 2) * 3,
                y: Math.sin(Math.random() * Math.PI * 2) * 3,
                z: 0,
                node_type: 'note'
            })
            .select()
            .single();

        if (error) throw error;
        
        // Create the node object with the database ID
        const newNode: MindMapNode = {
            id: mindmapNodes.node_id,
            label: mindmapNodes.title,
            title: mindmapNodes.title,
            description: mindmapNodes.description,
            x: mindmapNodes.x,
            y: mindmapNodes.y,
            z: mindmapNodes.z,
            type: 'main',
            nodeType: mindmapNodes.node_type,
            parentId: centerNode.id,
            color: '#2196F3',
            isCenter: false
        };
        
        nodes.update(currentNodes => [...currentNodes, newNode]);
        mindMapComponent.addNodeToScene(newNode);
        
        console.log('New node created:', newNode);
    } catch (error) {
        console.error('Error creating new node:', error);
    }
  }

  async function handleAddChildNode(parentNodeId: number) {
    if (!mindMapComponent || !selectedMindMapId) return;
    
    try {
        const parentNode = $nodes.find(node => node.id === parentNodeId);
        if (!parentNode) return;
        
        // First, create the node in the database
        const { data: mindmapNodes, error } = await supabase
            .from('mindmap_nodes')
            .insert({
                mindmap_id: selectedMindMapId,
                parent_node_id: parentNode.id,
                content: 'New Node',
                title: 'New Node',
                description: 'Click to edit',
                x: Math.cos(Math.random() * Math.PI * 2) * 3,
                y: Math.sin(Math.random() * Math.PI * 2) * 3,
                z: 0,
                node_type: 'note'
            })
            .select()
            .single();

        if (error) throw error;
        
        // Create the node object with the database ID
        const newNode: MindMapNode = {
            id: mindmapNodes.node_id,
            label: mindmapNodes.title,
            title: mindmapNodes.title,
            description: mindmapNodes.description,
            x: mindmapNodes.x,
            y: mindmapNodes.y,
            z: mindmapNodes.z,
            type: 'main',
            nodeType: mindmapNodes.node_type,
            parentId: parentNode.id,
            color: '#2196F3',
            isCenter: false
        };
        
        nodes.update(currentNodes => [...currentNodes, newNode]);
        mindMapComponent.addNodeToScene(newNode);
        
        console.log('New node created:', newNode);
    } catch (error) {
        console.error('Error creating new node:', error);
    }
  }
</script>

{#if isLoading}
  <div class="flex justify-center items-center h-screen">
    <div class="text-foreground text-xl">Loading...</div>
  </div>
{:else if pageError}
  <div class="text-center p-8 bg-red-100 rounded-lg max-w-md mx-auto">
    <h1 class="text-red-600 mb-4">Error</h1>
    <p class="text-foreground mb-4">{pageError.message}</p>
    <a href="/login?redirectTo=/maps" class="btn-primary">Return to Login</a>
  </div>
{:else if !isAuthenticated}
  <div class="text-center p-8 bg-gray-100 rounded-lg max-w-md mx-auto">
    <p class="text-foreground mb-4">Please log in to access this page</p>
    <a href="/login?redirectTo=/maps" class="btn-primary">Log In</a>
  </div>
{:else}
  <div class="container mx-auto px-4">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-4xl text-foreground">Toit Mind Map</h1>
      <div class="flex gap-4">
        <button
          on:click={handleNewMap}
          class="btn-primary"
        >
          Create New Map
        </button>
        <a href="/" class="btn-primary">Back to Home</a>
      </div>
    </div>

    <div class="grid grid-cols-4 gap-8">
      <div class="glass-panel">
        {#if !isCreatingNew}
          <select
            class="input-field w-full mb-4"
            on:change={handleMindMapSelect}
            value={selectedMindMapId || ''}
          >
            <option value="">Select a mind map</option>
            {#each mindMaps as map}
              <option value={map.mindmap_id}>{map.name}</option>
            {/each}
          </select>
        {/if}

        <form 
          on:submit|preventDefault={handleSaveMindMap}
          class="space-y-4"
        >
          <div>
            <label for="map_name" class="block text-foreground mb-2">
              {isCreatingNew ? 'New Mind Map Name' : 'Mind Map Name'}
            </label>
            <input
              type="text"
              id="map_name" 
              bind:value={newMapName}
              required 
              class="input-field"
              placeholder={isCreatingNew ? 'Enter new map name' : 'Update map name'}
            >
          </div>
          <div>
            <label for="map_description" class="block text-foreground mb-2">Description</label>
            <textarea 
              id="map_description" 
              bind:value={newMapDescription}
              class="input-field"
              placeholder="Add a description (optional)"
            ></textarea>
          </div>
          <button type="submit" class="btn-primary w-full">
            {isCreatingNew ? 'Create Mind Map' : 'Save Changes'}
          </button>
          {#if isCreatingNew}
            <button 
              type="button" 
              class="btn-secondary w-full"
              on:click={() => {
                isCreatingNew = false;
                selectedMindMapId = null;
              }}
            >
              Cancel
            </button>
          {/if}
        </form>
      </div>

      <div class="col-span-3 grid grid-cols-3 gap-8">
        <div class="col-span-2">
          <MindMap3D
            bind:this={mindMapComponent}
            on:nodeSelect={handleNodeSelect}
          />
        </div>

        <div class="flex flex-col gap-4">
          <button on:click={handleAddNode} class="btn-secondary">Add Node</button>
          
          <!-- Add layout controls -->
          <div class="glass-panel p-4">
            <h3 class="text-foreground mb-4">Layout Options</h3>
            <button on:click={() => mindMapComponent?.applyLayout('force')} class="btn-secondary w-full mb-2">
              Apply Force Layout
            </button>
            <p class="text-sm text-muted-foreground">
              Note: This will rearrange nodes but their positions will be saved to the database when you save the mind map.
            </p>
          </div>
          
          {#if selectedNodeId !== null && selectedNodePosition !== null}
            <div class="glass-panel p-4">
              <h3 class="text-foreground mb-4">Edit Node</h3>
              <NodeDataForm
                nodeId={selectedNodeId}
                position={selectedNodePosition}
                nodeData={{
                  title: $nodes.find(n => n.id === selectedNodeId)?.title || '',
                  description: $nodes.find(n => n.id === selectedNodeId)?.description || '',
                  nodeType: $nodes.find(n => n.id === selectedNodeId)?.nodeType || 'note',
                  parentId: $nodes.find(n => n.id === selectedNodeId)?.parentId || null
                }}
                on:save={handleFormSave}
                on:addChild={(event) => handleAddChildNode(event.detail.parentId)}
                on:close={() => {
                  selectedNodeId = null;
                  selectedNodePosition = null;
                }}
              />
            </div>
          {/if}

          <div class="mt-auto">
            <NodeTable nodes={$nodes} />
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

{#if formError}
  <div class="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded shadow-lg">
    {formError}
  </div>
{/if}

{#if formSuccess}
  <div class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded shadow-lg">
    Mind map saved successfully!
  </div>
{/if}

<style global>
  /* These styles are causing conflicts with the global theme */
  /* Instead of custom styles, we'll use the global theme classes */
  
  /* Ensure we don't override any global theme styles */
  :global(body) {
    /* Remove any background overrides */
  }
</style>