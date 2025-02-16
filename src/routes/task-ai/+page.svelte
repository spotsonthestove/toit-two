<script lang="ts">
    import MindMap3D from '$lib/components/MindMap3D.svelte';
    import NodeDataForm from '$lib/components/NodeDataForm.svelte';
    import { enhance } from '$app/forms';
    import type { PageData } from './$types';
    import type { Task, TaskCreateResponse } from '$lib/types';
    
    export let data: PageData;
    
    let currentTask = '';
    let taskList: Task[] = data.tasks;
    let selectedTask: Task | null = null;
    let isProcessing = false;
    let error: string | null = null;
    
    function handleTaskSelect(task: Task) {
        selectedTask = task;
    }

    $: taskList = data.tasks;

    function handleEnhance() {
        return ({ formData, formElement, action, result, update }) => {
            isProcessing = true;
            error = null;

            if (result.type === 'error') {
                isProcessing = false;
                error = result.error?.message || 'An error occurred';
                return;
            }
            
            if (result.type === 'success') {
                currentTask = '';
                update();
                isProcessing = false;
            }
        };
    }
</script>

<div class="container">
    <header class="header">
        <div class="logo">Toit</div>
        <nav>
            <a href="/task-ai" class="active">Tasks</a>
            <a href="/maps">Mind Map</a>
            <a href="/settings">Settings</a>
        </nav>
    </header>

    <main class="split-view">
        <!-- Task List Panel -->
        <section class="task-panel">
            <div class="task-input">
                <h2>New Task</h2>
                <form method="POST" action="?/createTask" use:enhance={handleEnhance}>
                    <textarea 
                        name="taskDescription"
                        bind:value={currentTask}
                        placeholder="Enter your task details..."
                        rows="4"
                        disabled={isProcessing}
                    ></textarea>
                    <button type="submit" disabled={isProcessing}>
                        {#if isProcessing}
                            Processing with AI...
                        {:else}
                            Generate Subtasks
                        {/if}
                    </button>
                    {#if error}
                        <div class="error-message">
                            {error}
                        </div>
                    {/if}
                </form>
            </div>

            <div class="task-list">
                <h3>Your Tasks</h3>
                {#if taskList.length === 0}
                    <p class="empty-state">No tasks yet. Create one above!</p>
                {:else}
                    {#each taskList as task}
                        <div 
                            class="task-item" 
                            class:selected={selectedTask?.id === task.id}
                            on:click={() => handleTaskSelect(task)}
                        >
                            <h4>{task.title}</h4>
                            <p>{task.description}</p>
                            {#if task.ai_generated}
                                <span class="ai-badge">AI Generated</span>
                            {/if}
                        </div>
                    {/each}
                {/if}
            </div>
        </section>

        <!-- Mind Map Panel -->
        <section class="mindmap-panel">
            {#if selectedTask}
                <MindMap3D />
            {:else}
                <div class="empty-state">
                    <p>Select a task to view its mind map</p>
                </div>
            {/if}
        </section>
    </main>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        background: #f8f9fa;
        border-bottom: 1px solid #e9ecef;
    }

    .logo {
        font-size: 1.5rem;
        font-weight: bold;
    }

    nav {
        display: flex;
        gap: 1rem;
    }

    nav a {
        text-decoration: none;
        color: #495057;
        padding: 0.5rem 1rem;
        border-radius: 4px;
    }

    nav a.active {
        background: #e9ecef;
    }

    .split-view {
        display: flex;
        flex: 1;
        overflow: hidden;
    }

    .task-panel {
        width: 400px;
        border-right: 1px solid #e9ecef;
        display: flex;
        flex-direction: column;
        padding: 1rem;
    }

    .task-input {
        margin-bottom: 2rem;
    }

    textarea {
        width: 100%;
        padding: 0.5rem;
        margin: 0.5rem 0;
        border: 1px solid #ced4da;
        border-radius: 4px;
        resize: vertical;
    }

    textarea:disabled {
        background: #e9ecef;
        cursor: not-allowed;
    }

    button {
        width: 100%;
        padding: 0.5rem;
        background: #228be6;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    button:disabled {
        background: #74c0fc;
        cursor: not-allowed;
    }

    button:hover:not(:disabled) {
        background: #1c7ed6;
    }

    .error-message {
        margin-top: 0.5rem;
        padding: 0.5rem;
        color: #e03131;
        background: #fff5f5;
        border: 1px solid #ffc9c9;
        border-radius: 4px;
    }

    .task-list {
        flex: 1;
        overflow-y: auto;
    }

    .task-item {
        padding: 1rem;
        border: 1px solid #e9ecef;
        border-radius: 4px;
        margin-bottom: 0.5rem;
        cursor: pointer;
        position: relative;
    }

    .task-item:hover {
        background: #f8f9fa;
    }

    .task-item.selected {
        border-color: #228be6;
        background: #e7f5ff;
    }

    .ai-badge {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
        background: #228be6;
        color: white;
        border-radius: 4px;
    }

    .mindmap-panel {
        flex: 1;
        background: #f8f9fa;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .empty-state {
        color: #868e96;
        text-align: center;
    }
</style> 