<script lang="ts">
    import { T } from '@threlte/core';
    import { TubeGeometry, MeshPhongMaterial, Vector3, QuadraticBezierCurve3 } from 'three';
    
    export let startNode: any; // Replace with proper type
    export let endNode: any; // Replace with proper type
    
    $: curve = createCurve(startNode, endNode);
    
    function createCurve(start: any, end: any) {
        const startPos = new Vector3(start.x, start.y, start.z);
        const endPos = new Vector3(end.x, end.y, end.z);
        
        const midPoint = new Vector3().lerpVectors(startPos, endPos, 0.5);
        const normal = new Vector3().subVectors(endPos, startPos).normalize();
        const binormal = new Vector3(0, 1, 0);
        const tangent = new Vector3().crossVectors(normal, binormal);
        
        const bulgeFactor = 0.5;
        const controlPoint = midPoint.clone().addScaledVector(tangent, bulgeFactor);
        
        return new QuadraticBezierCurve3(startPos, controlPoint, endPos);
    }
</script>

<T is={TubeGeometry} args={[curve, 64, 0.1, 8, false]}>
    <T is={MeshPhongMaterial} 
        color="#ff0000"
        transparent
        opacity={0.7}
    />
</T> 