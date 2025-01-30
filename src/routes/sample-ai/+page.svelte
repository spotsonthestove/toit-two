<script lang="ts">
    import type { PageData } from './$types';
    import { enhance } from '$app/forms';
    import type { SubmitFunction } from '@sveltejs/kit';

    export let data: PageData;
    
    let userTask = '';
    let subtasks: Array<{ id: number; description: string }> = [];
    let isSubmitting = false;
    let debugInfo = '';
    let error: string | null = null;
    
    interface AIResponse {
        data: {
            response: string;
        };
    }
    
    // Debug logging for data updates
    $: {
        console.log('Data updated:', data);
        debugInfo = JSON.stringify(data, null, 2);
    }
    
    const handleSubmit: SubmitFunction = (event) => {
        isSubmitting = true;
        error = null;
        
        return async ({ result }) => {
            console.log('Form submission result:', result);
            
            if (result.type === 'success') {
                const response = result.data as AIResponse;
                const responseText = response?.data?.response;
                
                if (responseText) {
                    try {
                        // Split the response by newlines and filter empty lines
                        subtasks = responseText
                            .split('\n')
                            .filter((task: string) => task.trim())
                            .filter((task: string) => /^\d+\./.test(task)) // Only keep numbered lines
                            .map((task: string, index: number) => ({
                                id: index + 1,
                                description: task.replace(/^\d+\.\s*/, '').trim() // Remove the number prefix
                            }));
                        console.log('Parsed subtasks:', subtasks);
                    } catch (err) {
                        console.error('Error parsing response:', err);
                        error = 'Failed to parse the response';
                    }
                } else {
                    error = 'No response received from AI';
                }
            } else {
                error = 'Failed to get AI response';
                subtasks = [];
            }
            
            isSubmitting = false;
        };
    };
</script>

<div class="container">
    <h1>Task Breakdown Assistant</h1>
    
    <form 
        method="POST" 
        class="task-form" 
        use:enhance={handleSubmit}
    >
        <div class="input-group">
            <label for="task">Enter your task:</label>
            <textarea 
                id="task" 
                name="task" 
                bind:value={userTask} 
                placeholder="Describe the task you want to break down..."
                rows="4"
                disabled={isSubmitting}
            ></textarea>
        </div>
        <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Breaking down task...' : 'Break Down Task'}
        </button>
    </form>

    {#if error}
        <div class="error">
            {error}
        </div>
    {/if}

    {#if subtasks.length > 0}
        <div class="results">
            <h2>Task Breakdown</h2>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Subtask</th>
                    </tr>
                </thead>
                <tbody>
                    {#each subtasks as { id, description }}
                        <tr>
                            <td>{id}</td>
                            <td>{description}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}

    <!-- Debug output -->
    <div class="debug">
        <h3>Debug Info:</h3>
        <pre>{debugInfo}</pre>
    </div>
</div>

<style>
    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
    }
    
    .task-form {
        margin: 2rem 0;
    }
    
    .input-group {
        margin-bottom: 1rem;
    }
    
    label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: bold;
    }
    
    textarea {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    
    textarea:disabled {
        background-color: #f5f5f5;
        cursor: not-allowed;
    }
    
    button {
        background-color: #4CAF50;
        color: white;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    
    button:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }
    
    button:hover:not(:disabled) {
        background-color: #45a049;
    }
    
    .error {
        margin: 1rem 0;
        padding: 0.5rem 1rem;
        background-color: #ffebee;
        color: #c62828;
        border-radius: 4px;
    }
    
    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 1rem;
    }
    
    th, td {
        padding: 0.75rem;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }
    
    th {
        background-color: #f5f5f5;
        font-weight: bold;
    }

    .debug {
        margin-top: 2rem;
        padding: 1rem;
        background-color: #f5f5f5;
        border-radius: 4px;
    }

    .debug pre {
        white-space: pre-wrap;
        word-wrap: break-word;
    }
</style> 
