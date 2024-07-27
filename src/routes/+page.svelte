<script lang="ts">
  import MindMap3D from '$lib/components/MindMap3D.svelte';
  import CircleSegment from '$lib/components/toitNext1.svelte';
  import { onMount } from 'svelte';

  let mindMapComponent: MindMap3D;

  function addNode() {
    if (mindMapComponent) {
      const x = Math.random() * 6 - 3; // Random x between -3 and 3
      const y = Math.random() * 6 - 3; // Random y between -3 and 3
      const z = Math.random() * 2 - 1; // Random z between -1 and 1
      mindMapComponent.addNode(x, y, z);
    }
  }

  onMount(() => {
    // Any initialization if needed
  });
</script>

<h1>Toit</h1>

<h1>This will be something when I get a round Toit</h1>
  
<div class="container">
    <h2>Toit Circle</h2>
    <CircleSegment />
</div>

<div class="grid-container">
  <div class="mind-map">
    <MindMap3D bind:this={mindMapComponent} />
  </div>
  <div class="controls">
    <button on:click={addNode}>Add Node</button>
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
</style>