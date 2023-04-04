<script>
  import { onMount } from 'svelte';

  import { Canvas, InteractiveObject, OrbitControls, T } from '@threlte/core';
  import { spring } from 'svelte/motion';
  import { Color, TorusGeometry, Float32BufferAttribute } from 'three';
  import { degToRad } from 'three/src/math/MathUtils'; // Updated import
  import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

  let mesh;
  let mergedGeometry;

  const colors = [
    new Color('lightgreen'),
    new Color('green'),
    new Color('darkgreen'),
  ];
  const scale = spring(1);

  const segmentCount = colors.length;
  const totalAngle = Math.PI * 2;
  const segmentAngle = totalAngle / segmentCount;

  function createSegment(color, startAngle) {
    console.log('Creating segment with color:', color, 'and start angle:', startAngle);
    const geometry = new TorusGeometry(1, 0.4, 8, 8, segmentAngle);
    geometry.rotateY(startAngle);
    geometry.computeVertexNormals();

    const colorAttribute = new Float32BufferAttribute(new Float32Array(geometry.attributes.position.count * 3), 3);
    for (let i = 0; i < colorAttribute.count; i++) {
      color.toArray(colorAttribute.array, i * 3);
    }
    geometry.setAttribute('color', colorAttribute);

    return geometry;
  }

  onMount(async () => {
    const segmentGeometries = colors.map((color, index) => {
      const startAngle = index * segmentAngle;
      return createSegment(color, startAngle);
    });

    mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(segmentGeometries);
    if (mesh) {
      mesh.geometry.dispose(); // Dispose of the previous geometry to avoid memory leaks
      mesh.geometry = mergedGeometry;
    }
  });
</script>

<div>
  <Canvas>
    <T.PerspectiveCamera makeDefault position={[5, 5, 5]} fov={24}>
      <OrbitControls maxPolarAngle={degToRad(80)} enableZoom={false} target={{ y: 0.5 }} />
    </T.PerspectiveCamera>

    <T.DirectionalLight castShadow position={[3, 10, 10]} />
    <T.DirectionalLight position={[-3, 10, -10]} intensity={0.2} />
    <T.AmbientLight intensity={0.2} />

    <!-- Doughnut (Torus) -->
    <T.Mesh bind:this={mesh} position.y={0.5} scale={$scale} castShadow let:ref>
      <InteractiveObject
        object={ref}
        interactive
        on:pointerenter={() => ($scale = 2)}
        on:pointerleave={() => ($scale = 1)}
      />
      <T.BufferGeometry geometry={mergedGeometry} />
      <T.MeshStandardMaterial vertexColors />
    </T.Mesh>
        

    <!-- Floor -->
    <T.Mesh receiveShadow rotation.x={degToRad(-90)}>
      <T.CircleGeometry args={[3, 72]} />
      <T.MeshStandardMaterial color="white" />
    </T.Mesh>
  </Canvas>
</div>





<style>
  div {
    height: 100%;
    width: 100%;
  }
</style>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
