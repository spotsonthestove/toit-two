<script lang="ts">
  import MindMapPlane from '$lib/components/mindMap-plane.svelte';
  import NodeTable from '$lib/components/nodetable.svelte';
  import { onMount } from 'svelte';
  import { nodes } from '$lib/stores/mindMapStore';

  let mindMapComponent: MindMapPlane;

  function handleAddNode() {
    if (mindMapComponent) {
      const x = Math.random() * 6 - 3;
      const y = Math.random() * 6 - 3;
      const z = Math.random() * 2 - 1;
      mindMapComponent.addNode(x, y, z);
    }
  }

  onMount(() => {
    if (mindMapComponent) {
      if ($nodes.length === 0) {
        // Initialize with default nodes if the store is empty
        mindMapComponent.addNode(0, 0, 0);
        mindMapComponent.addNode(3, 2, 0);
        mindMapComponent.addNode(-2, 3, 1);
      } else {
        // Initialize with stored nodes
        mindMapComponent.initializeNodesFromStore($nodes);
      }
    }
  });
</script>

<h1>Toit</h1>

<h1>TriToit and Mind Map</h1>

<nav>
  <a href="/">Back to Home</a>
</nav>
  
<!-- <div class="container">
    <h2>Toit Circle</h2>
    <CircleSegment />
</div> -->

<div class="grid-container">
  <div class="mind-map">
    <MindMapPlane bind:this={mindMapComponent} />
  </div>
  <div class="controls">
    <button on:click={handleAddNode}>Add Node</button>
    <NodeTable nodes={$nodes} />
  </div>
</div>

<style>
    :global(body) {
        font-family: Arial, sans-serif;
        background: linear-gradient(135deg, #4caf50, #1a1a1a);
        min-height: 100vh;
        margin: 0;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }
    .container {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 10px;
        padding: 30px;
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        border: 1px solid rgba(255, 255, 255, 0.18);
        width: 100%;
        max-width: 400px;
    }
    h1, h2 {
        color: #fff;
        text-align: center;
        margin-bottom: 20px;
    }
    form {
        display: flex;
        margin-bottom: 20px;
    }
    input[type="text"] {
        flex-grow: 1;
        padding: 10px;
        border: none;
        border-radius: 5px 0 0 5px;
        outline: none;
    }
    button {
        padding: 10px 20px;
        background-color: #4caf50;
        color: white;
        border: none;
        border-radius: 0 5px 5px 0;
        cursor: pointer;
    }
    ul {
        list-style-type: none;
        padding: 0;
    }
    li {
        background: rgba(255, 255, 255, 0.2);
        margin-bottom: 10px;
        padding: 10px;
        border-radius: 5px;
        color: #fff;
    }
    .grid-container {
        display: grid;
        grid-template-columns: 1fr 200px;
        grid-template-rows: 1fr;
        gap: 20px;
        height: 70vh;
        width: 100%;
        max-width: 64rem;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        border: 1px solid rgba(255, 255, 255, 0.18);
    }
    .mind-map {
        grid-column: 1;
        grid-row: 1;
        width: 100%;
        height: 100%;
    }
    .controls {
        grid-column: 2;
        grid-row: 1;
        display: flex;
        flex-direction: column;
        gap: 10px;
        overflow-y: auto;
    }
    .controls button {
        padding: 10px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
    }
    .controls button:hover {
        background-color: #45a049;
    }
    @media (min-width: 480px) {
        h1 {
            font-size: 4rem;
        }
    }
    nav {
        margin-bottom: 20px;
    }

    nav a {
        color: #fff;
        text-decoration: none;
        padding: 10px 20px;
        background-color: #4CAF50;
        border-radius: 5px;
        transition: background-color 0.3s;
    }

    nav a:hover {
        background-color: #45a049;
    }
</style>