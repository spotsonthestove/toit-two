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
        padding: 1rem;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .main {
        display: flex;
        flex: 1;
        gap: 1rem;
        overflow: hidden;
    }

    .sidebar {
        width: 300px;
        display: flex;
        flex-direction: column;
    }

    .task-list {
        flex: 1;
        overflow-y: auto;
        padding-right: 0.5rem;
    }

    .task-item {
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        border-radius: 4px;
        background-color: var(--card);
        border: 1px solid var(--border);
        cursor: pointer;
    }

    .task-item:hover {
        background-color: var(--accent);
    }

    .task-item.selected {
        background-color: var(--primary);
        color: var(--primary-foreground);
    }

    .task-form {
        margin-top: 1rem;
    }

    .form-group {
        margin-bottom: 0.5rem;
    }

    .form-control {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid var(--border);
        border-radius: 4px;
        background-color: var(--background);
        color: var(--foreground);
    }

    .btn {
        padding: 0.25rem 0.5rem;
        background-color: var(--primary);
        color: var(--primary-foreground);
        border-radius: 4px;
    }

    .mindmap-panel {
        flex: 1;
        background-color: var(--background);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .empty-state {
        color: var(--muted-foreground);
        text-align: center;
    }
</style> 