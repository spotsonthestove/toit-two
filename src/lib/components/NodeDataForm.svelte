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
    };
    
    // Initialize local state with the provided nodeData
    let localTitle = nodeData.title;
    let localDescription = nodeData.description;
    let localNodeType = nodeData.nodeType;
    let localParentId = nodeData.parentId;
    
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
            parentId: localParentId
        });
    }
</script>

<form on:submit={handleSubmit} class="space-y-4">
    <div>
        <label class="block text-white mb-2">Title</label>
        <input 
            type="text" 
            bind:value={localTitle}
            class="input-field" 
            required
        />
    </div>

    <div>
        <label class="block text-white mb-2">Description</label>
        <textarea 
            bind:value={localDescription}
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
