<script lang="ts">
  import { onMount } from 'svelte';
  import MindMap3D from '$lib/components/MindMap3D_TEST.svelte';
  import NodeEditor from '$lib/components/NodeEditor.svelte';
  import MapList from '$lib/components/MapList.svelte';
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Textarea } from "$lib/components/ui/textarea";
  import { nodes, selectedNode } from '$lib/stores/mindMapStore';
  import type { MindMapNode } from '$lib/types/mindmap';
  import { createMindMap, getMindMaps, updateMindMap } from '$lib/supabaseClient';

  let mindMapComponent: MindMap3D;
  let maps = [];
  let selectedMapId: number | null = null;
  let newMapName = '';
  let newMapDescription = '';
  let isCreatingNew = false;

  onMount(async () => {
    maps = await getMindMaps();
  });

  async function handleCreateMap() {
    if (!newMapName) return;

    const initialNode: MindMapNode = {
      id: 1,
      title: 'Central Idea',
      description: 'Click to edit',
      x: 0,
      y: 0,
      z: 0,
      nodeType: 'concept',
      parentId: null,
      isCenter: true
    };

    const result = await createMindMap(newMapName, newMapDescription, [initialNode]);
    maps = [...maps, result];
    selectedMapId = result.mindmap_id;
    isCreatingNew = false;
    selectedNode.set(null);
    nodes.set([initialNode]);
    mindMapComponent.initializeNodesFromStore([initialNode]);
  }

  async function handleMapSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    selectedMapId = parseInt(select.value);
    const selectedMap = maps.find(map => map.mindmap_id === selectedMapId);
    if (selectedMap) {
      newMapName = selectedMap.name;
      newMapDescription = selectedMap.description;
      nodes.set(selectedMap.mindmap_nodes);
      selectedNode.set(null);
      mindMapComponent.initializeNodesFromStore(selectedMap.mindmap_nodes);
    }
  }

  function handleNodeSelect(event: CustomEvent) {
    const { nodeData } = event.detail;
    selectedNode.set(nodeData);
  }

  async function handleSaveMap() {
    if (!selectedMapId) return;
    await updateMindMap(selectedMapId, newMapName, newMapDescription, $nodes);
    maps = await getMindMaps();
  }

  function handleAddNode() {
    if (!mindMapComponent) return;
    const newNodeId = Math.max(...$nodes.map(node => node.id)) + 1;
    const centerNode = $nodes.find(node => node.isCenter);
    if (!centerNode) return;

    const angle = Math.random() * Math.PI * 2;
    const radius = 3;
    const newNode: MindMapNode = {
      id: newNodeId,
      title: 'New Node',
      description: 'Click to edit',
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      z: 0,
      nodeType: 'note',
      parentId: centerNode.id,
      isCenter: false
    };

    nodes.update(currentNodes => [...currentNodes, newNode]);
    mindMapComponent.addNodeToScene(newNode);
  }

  function clearNodeSelection() {
    selectedNode.set(null);
  }
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6">Mind Map Creator</h1>

  <div class="grid grid-cols-3 gap-8">
    <div class="col-span-1">
      <MapList {maps} {selectedMapId} on:select={handleMapSelect} />

      <div class="mt-6">
        <Button on:click={() => isCreatingNew = true} variant="outline">Create New Map</Button>
      </div>

      {#if isCreatingNew || selectedMapId}
        <form on:submit|preventDefault={isCreatingNew ? handleCreateMap : handleSaveMap} class="mt-6 space-y-4">
          <div>
            <Label for="mapName">Map Name</Label>
            <Input id="mapName" bind:value={newMapName} required />
          </div>
          <div>
            <Label for="mapDescription">Description</Label>
            <Textarea id="mapDescription" bind:value={newMapDescription} />
          </div>
          <Button type="submit">{isCreatingNew ? 'Create Map' : 'Save Changes'}</Button>
        </form>
      {/if}
    </div>

    <div class="col-span-2">
      <div class="mb-4 flex justify-between items-center">
        <h2 class="text-2xl font-semibold">Mind Map Viewer</h2>
        <Button on:click={handleAddNode}>Add Node</Button>
      </div>
      <MindMap3D bind:this={mindMapComponent} on:nodeSelect={handleNodeSelect} />
    </div>
  </div>

  <NodeEditor />
</div>

