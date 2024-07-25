<script lang="ts">
import CircleSegment from '$lib/components/toitNext1.svelte';
import MindMap3D from '$lib/components/MindMap3D.svelte';
</script>

<h1>Toit</h1>

<h1>This will be something when I get a round Toit</h1>
  
<div class="container">
    <h2>Toit Circle</h2>
    <CircleSegment />
</div>

<div class="container">
    <h1>Toits</h1>
    <form id="todo-form">
        <input type="text" id="todo-input" placeholder="Add a new toit..." required>
        <button type="submit">Add</button>
    </form>
    <ul id="todo-list">
        <!-- Toit items will be added here dynamically -->
    </ul>
</div>

<div class="mindmap-container">
    <MindMap3D />
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
    .mindmap-container {
        width: 100%;
        height: 500px;
        margin-top: 20px;
    }
</style>