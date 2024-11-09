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

  export let data;

  let mindMapComponent: MindMap3D;
  let formError = '';
  let formSuccess = false;

  let isInitializing = true;

  $: isAuthenticated = browser && (data.session?.user || $user);
  $: pageError = $page.error;

  onMount(async () => {
    if (browser) {
      await tick();
      
      if (data.session?.user && !$user) {
        $user = data.session.user;
      }

      try {
        if (mindMapComponent) {
          if ($nodes.length === 0) {
            mindMapComponent.createInitialNodes();
          } else {
            mindMapComponent.initializeNodesFromStore($nodes);
          }
        }
      } catch (error) {
        console.error('Error initializing mind map:', error);
      }
    }
    
    isInitializing = false;
  });

  const handleSubmit = () => {
    return async ({ result, update }: { result: ActionResult, update: () => Promise<void> }) => {
      await update();
      
      if (result.type === 'failure') {
        formError = result.data?.message || 'Failed to save mind map';
        formSuccess = false;
        
        if (result.status === 401) {
          goto('/login');
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
</script>

{#if pageError}
    <div class="error-container">
        <h1>Error</h1>
        <p>{pageError.message}</p>
        <a href="/login" class="login-button">Return to Login</a>
    </div>
{:else if isInitializing}
    <div class="loading">Initializing...</div>
{:else if isAuthenticated}
    <h1>Toit</h1>

    <h1>TriToit and Mind Map</h1>

    <nav>
        <a href="/">Back to Home</a>
    </nav>

    <!-- Add this form section before the grid-container -->
    <div class="mindmap-form">
        {#if formError}
            <div class="error-message">
                {formError}
            </div>
        {/if}
        {#if formSuccess}
            <div class="success-message">
                Mind map saved successfully!
            </div>
        {/if}
        
        <form 
            method="POST" 
            action="?/createList" 
            use:enhance={handleSubmit}
        >
            <div class="form-group">
                <label for="list_name">Mind Map Name</label>
                <input 
                    type="text" 
                    id="list_name" 
                    name="list_name" 
                    required 
                    placeholder="Enter mind map name"
                >
            </div>
            <div class="form-group">
                <label for="list_color">Color Theme</label>
                <input 
                    type="color" 
                    id="list_color" 
                    name="list_color" 
                    value="#4CAF50"
                >
            </div>
            <button type="submit">Save Mind Map</button>
        </form>
    </div>

    <div class="grid-container">
        <div class="mind-map">
            <MindMap3D bind:this={mindMapComponent} />
        </div>
        <div class="controls">
            <button on:click={handleAddNode}>Add Node</button>
            <NodeTable nodes={$nodes} />
        </div>
    </div>
{:else}
  <div class="auth-message">
    <p>Please log in to access this page</p>
    <a href="/login?redirectTo=/toit" class="login-button">Log In</a>
  </div>
{/if}

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

    .mindmap-form {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        border: 1px solid rgba(255, 255, 255, 0.18);
        width: 100%;
        max-width: 64rem;
    }

    .form-group {
        margin-bottom: 15px;
    }

    .form-group label {
        display: block;
        color: white;
        margin-bottom: 5px;
    }

    .form-group input[type="text"] {
        width: 100%;
        padding: 8px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.1);
        color: white;
    }

    .form-group input[type="color"] {
        width: 100px;
        height: 40px;
        border: none;
        border-radius: 5px;
        background: none;
    }

    .mindmap-form button[type="submit"] {
        width: 100%;
        padding: 10px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        margin-top: 10px;
    }

    .mindmap-form button[type="submit"]:hover {
        background-color: #45a049;
    }

    .error-message {
        background-color: rgba(255, 0, 0, 0.1);
        border: 1px solid rgba(255, 0, 0, 0.3);
        color: #ff0000;
        padding: 10px;
        margin-bottom: 15px;
        border-radius: 5px;
    }

    .success-message {
        background-color: rgba(0, 255, 0, 0.1);
        border: 1px solid rgba(0, 255, 0, 0.3);
        color: #00ff00;
        padding: 10px;
        margin-bottom: 15px;
        border-radius: 5px;
    }

    .auth-message {
        text-align: center;
        padding: 2rem;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 10px;
        margin: 2rem auto;
        max-width: 400px;
    }

    .login-button {
        display: inline-block;
        margin-top: 1rem;
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        transition: background-color 0.3s;
    }

    .login-button:hover {
        background-color: #45a049;
    }

    .error-container {
        text-align: center;
        padding: 2rem;
        background: rgba(255, 0, 0, 0.1);
        border-radius: 10px;
        margin: 2rem auto;
        max-width: 400px;
    }

    .error-container h1 {
        color: #ff4444;
        margin-bottom: 1rem;
    }

    .error-container p {
        color: white;
        margin-bottom: 1rem;
    }
</style>