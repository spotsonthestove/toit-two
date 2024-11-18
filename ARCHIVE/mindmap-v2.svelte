<script lang="ts">
    import { Canvas } from '@threlte/core';
    import { OrbitControls } from '@threlte/extras';
    import Scene from './mindmap/Scene.svelte';
    import { nodes as nodesStore } from '../stores/mindMapStore';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    let mounted = false;

    // Match the original component's public methods
    export function addNode(x: number, y: number, z: number, isCenter = false): void {
        const newNode = {
            id: $nodesStore.length,
            x, y, z,
            isCenter
        };
        nodesStore.update(nodes => [...nodes, newNode]);
    }

    export function createInitialNodes(): void {
        nodesStore.set([]); // Clear existing nodes
        addNode(0, 0, 0, true);  // Center node
        addNode(3, 2, 0);        // Additional nodes
        addNode(-2, 3, 1);
    }

    export function initializeNodesFromStore(nodeData: any[]): void {
        nodesStore.set(nodeData);
    }
</script>

<Canvas>
    <OrbitControls />
    <Scene />
</Canvas>

<style>
    .container {
        width: 100%;
        height: 100%;
    }
</style>
