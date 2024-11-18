<script lang="ts">
    import { useFrame, T } from '@threlte/core';
    import { AmbientLight, DirectionalLight, Color } from 'three';
    import { spring } from 'svelte/motion';
    import Node from './Node.svelte';
    import Branch from './Branch.svelte';
    
    export let nodesStore: any; // Replace with proper type

    const lightPosition = spring([5, 5, 5], {
        stiffness: 0.1,
        damping: 0.4
    });
</script>

<T is={AmbientLight} intensity={0.4} />
<T 
    is={DirectionalLight}
    intensity={0.6}
    position={$lightPosition}
    castShadow
/>

<T is={Color} args={[0xcccccc]} attach="background" />

{#each $nodesStore as node (node.id)}
    <Node 
        position={[node.x, node.y, node.z]}
        isCenter={node.isCenter}
        nodeId={node.id}
    />
    
    {#if !node.isCenter && $nodesStore.find(n => n.isCenter)}
        <Branch 
            startNode={$nodesStore.find(n => n.isCenter)}
            endNode={node}
        />
    {/if}
{/each} 