<script lang="ts">
    import { T, useFrame } from '@threlte/core';
    import { SphereGeometry, MeshPhongMaterial } from 'three';
    import { spring } from 'svelte/motion';
    
    export let position: [number, number, number];
    export let isCenter = false;
    export let nodeId: number;

    const nodePosition = spring(position, {
        stiffness: 0.1,
        damping: 0.6
    });

    let isDragging = false;
    
    function handleDragStart() {
        isDragging = true;
    }
    
    function handleDragEnd() {
        isDragging = false;
    }
</script>

<T 
    interactive
    on:pointerdown={handleDragStart}
    on:pointerup={handleDragEnd}
    position={$nodePosition}
>
    <T is={SphereGeometry} args={[isCenter ? 0.75 : 0.5, 32, 32]}>
        <T is={MeshPhongMaterial}
            color={isCenter ? '#4CAF50' : '#00ff00'}
            emissive="#000000"
        />
    </T>
</T> 