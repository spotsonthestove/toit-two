<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { NodeType } from '$lib/types/mindmap';
    
    export let nodeId: number;
    export let position: { x: number; y: number; z: number };
    export let nodeData: {
        title: string;
        description: string;
        nodeType: NodeType;
        parentId: number | null;
        status?: 'pending' | 'in_progress' | 'completed';
        priority?: number;
        estimatedDuration?: number;
        tags?: string[];
        color?: string;
    };
    
    // Local state variables
    let localTitle = nodeData.title;
    let localDescription = nodeData.description;
    let localNodeType = nodeData.nodeType;
    let localParentId = nodeData.parentId;
    let localStatus = nodeData.status || 'pending';
    let localPriority = nodeData.priority || 3;
    let localEstimatedDuration = nodeData.estimatedDuration || 0;
    let localTags = nodeData.tags || [];
    let localColor = nodeData.color || '#2196F3';
    
    // Reactive statement to update local variables when nodeData changes
    $: {
        if (nodeData) {
            localTitle = nodeData.title || '';
            localDescription = nodeData.description || '';
            localNodeType = nodeData.nodeType;
            localParentId = nodeData.parentId;
            localStatus = nodeData.status || 'pending';
            localPriority = nodeData.priority || 3;
            localEstimatedDuration = nodeData.estimatedDuration || 0;
            localTags = nodeData.tags || [];
            localColor = nodeData.color || '#2196F3';
        }
    }
    
    console.log('NodeDataForm initialized with:', { nodeData, localTitle, localDescription, localParentId });
    
    const dispatch = createEventDispatcher();
    
    const nodeTypes: Array<{ value: NodeType; label: string }> = [
        { value: 'concept', label: 'Concept' },
        { value: 'note', label: 'Note' }
    ];
    
    function handleSubmit(e: Event) {
        e.preventDefault();
        console.log('Submitting form with:', { localTitle, localDescription, localNodeType, localParentId });
        
        dispatch('save', { 
            nodeId,
            position,
            title: localTitle,
            description: localDescription,
            nodeType: localNodeType,
            parentId: localParentId,
            status: localStatus,
            priority: localPriority,
            estimatedDuration: localEstimatedDuration,
            tags: localTags,
            color: localColor
        });
    }

    // Type-safe input handlers
    function handleTitleInput(e: Event) {
        const target = e.target as HTMLInputElement;
        localTitle = target.value;
    }

    function handleDescriptionInput(e: Event) {
        const target = e.target as HTMLTextAreaElement;
        localDescription = target.value;
    }
</script>

<form on:submit={handleSubmit} class="space-y-4">
    <div>
        <label class="block text-white mb-2">Title</label>
        <input 
            type="text" 
            value={localTitle}
            on:input={handleTitleInput}
            class="input-field" 
            required
        />
    </div>

    <div>
        <label class="block text-white mb-2">Description</label>
        <textarea 
            value={localDescription}
            on:input={handleDescriptionInput}
            class="input-field" 
            rows="3"
        ></textarea>
    </div>

    <div>
        <label class="block text-white mb-2">Node Type</label>
        <select bind:value={localNodeType} class="input-field">
            {#each nodeTypes as type}
                <option value={type.value}>{type.label}</option>
            {/each}
        </select>
    </div>

    <div>
        <label class="block text-white mb-2">Parent ID</label>
        <input 
            type="number" 
            bind:value={localParentId} 
            class="input-field" 
            readonly
        />
    </div>

    <div>
        <label class="block text-white mb-2">Position</label>
        <div class="grid grid-cols-3 gap-2">
            <div>
                <label class="block text-white text-sm mb-1">X</label>
                <input 
                    type="number" 
                    value={position.x} 
                    class="input-field" 
                    readonly
                />
            </div>
            <div>
                <label class="block text-white text-sm mb-1">Y</label>
                <input 
                    type="number" 
                    value={position.y} 
                    class="input-field" 
                    readonly
                />
            </div>
            <div>
                <label class="block text-white text-sm mb-1">Z</label>
                <input 
                    type="number" 
                    value={position.z} 
                    class="input-field" 
                    readonly
                />
            </div>
        </div>
    </div>
    
    <div class="flex gap-2">
        <button type="submit" class="btn-primary flex-1">Save</button>
        <button 
            type="button" 
            class="btn-secondary flex-1" 
            on:click={() => dispatch('addChild', { parentId: nodeId })}
        >
            Add Child Node
        </button>
        <button 
            type="button" 
            class="btn-secondary flex-1" 
            on:click={() => dispatch('close')}
        >
            Cancel
        </button>
    </div>

    <div>
        <label class="block text-white mb-2">Status</label>
        <select bind:value={localStatus} class="input-field">
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
        </select>
    </div>

    <div>
        <label class="block text-white mb-2">Priority</label>
        <input 
            type="number" 
            bind:value={localPriority}
            min="1" 
            max="5" 
            class="input-field"
        />
    </div>

    <div>
        <label class="block text-white mb-2">Estimated Duration</label>
        <input 
            type="number" 
            bind:value={localEstimatedDuration}
            class="input-field"
        />
    </div>

    <div>
        <label class="block text-white mb-2">Tags</label>
        <input 
            type="text" 
            bind:value={localTags}
            class="input-field"
        />
    </div>

    <div>
        <label class="block text-white mb-2">Color</label>
        <input 
            type="color" 
            bind:value={localColor}
            class="input-field"
        />
    </div>
</form>

<style>
    .input-field {
        @apply w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500;
    }

    .btn-primary {
        @apply px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800;
    }

    .btn-secondary {
        @apply px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800;
    }
</style>
