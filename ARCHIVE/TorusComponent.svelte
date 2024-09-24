
   <script>
    import { onMount } from 'svelte';
    import * as THREE from 'three';
    
    export let segments = 5;
    export let radius = 1;
    export let tube = 0.3;
    export let radialSegments = 16;
    export let tubularSegments = 100;
    
    let container;
    
    onMount(() => {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer();
    
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);
    
      const geometry = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments);
      const colors = [
        new THREE.Color(0xff0000), // Red
        new THREE.Color(0x00ff00), // Green
        new THREE.Color(0x0000ff), // Blue
        new THREE.Color(0xffff00), // Yellow
        new THREE.Color(0xff00ff), // Magenta
      ];
    
      const positionAttribute = geometry.getAttribute('position');
      const colorAttribute = new THREE.BufferAttribute(new Float32Array(positionAttribute.count * 3), 3);
    
      for (let i = 0; i < positionAttribute.count; i++) {
        const vertex = new THREE.Vector3();
        vertex.fromBufferAttribute(positionAttribute, i);
        
        // Calculate the angle of this vertex in the XZ plane
        const angle = Math.atan2(vertex.z, vertex.x);
        
        // Map the angle to a segment index
        const segmentIndex = Math.floor(((angle + Math.PI) / (2 * Math.PI)) * segments) % segments;
        
        const color = colors[segmentIndex % colors.length];
        colorAttribute.setXYZ(i, color.r, color.g, color.b);
      }
    
      geometry.setAttribute('color', colorAttribute);
    
      const material = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide });
      const torus = new THREE.Mesh(geometry, material);
      scene.add(torus);
    
      camera.position.z = 5;
    
      function animate() {
        requestAnimationFrame(animate);
        torus.rotation.x += 0.01;
        torus.rotation.y += 0.01;
        renderer.render(scene, camera);
      }
    
      animate();
    
      return () => {
        container.removeChild(renderer.domElement);
      };
    });
    </script>
    
    <div bind:this={container} style="width: 100%; height: 400px;"></div>