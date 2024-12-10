<script lang="ts">
  import MindMap3DTest from './MindMap3DTest.svelte';
</script>

<div class="flex h-screen">
  <div id="canvas-container" class="flex-1 relative">
    <MindMap3DTest />
    <button class="add-node-button" on:click={() => {}}>+</button>
  </div>
  
  <div class="sidebar">
    <div id="nodeEditor">
      <h2>Edit Node</h2>
      <form on:submit|preventDefault={() => {}}>
        <div class="form-group">
          <label for="title">Title</label>
          <input type="text" id="title" required>
        </div>
        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description"></textarea>
        </div>
        <div class="button-group">
          <button type="submit" class="button">Save</button>
          <button type="button" class="button secondary">Delete</button>
        </div>
      </form>
    </div>
    <div class="node-relationships">
      <h2>Node Relationships</h2>
      <div id="nodeRelationships"></div>
    </div>
  </div>
</div>

<style>
  .sidebar {
    width: 300px;
    background: #ffffff;
    border-left: 1px solid #e5e7eb;
    padding: 1rem;
    overflow-y: auto;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #4b5563;
  }

  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
  }

  .form-group textarea {
    height: 100px;
    resize: vertical;
  }

  .button {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    cursor: pointer;
    font-size: 0.875rem;
  }

  .button:hover {
    background: #2563eb;
  }

  .button.secondary {
    background: #9ca3af;
  }

  .button.secondary:hover {
    background: #6b7280;
  }

  .button-group {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .add-node-button {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    background: #3b82f6;
    color: white;
    border: none;
    padding: 0.75rem;
    border-radius: 50%;
    cursor: pointer;
    width: 3rem;
    height: 3rem;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .add-node-button:hover {
    background: #2563eb;
  }
</style> 