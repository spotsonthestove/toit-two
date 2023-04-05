<!-- src/lib/ThreeWheel.svelte -->
<script>
    import { onMount } from 'svelte';
    import * as THREE from 'three';
  
    let container;
  
    onMount(() => {
      // Create a scene
      const scene = new THREE.Scene();
  
      // Create a camera
      const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
      camera.position.z = 5;
  
      // Create a WebGLRenderer
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);
  
      // Create a circle geometry
      const radius = 1;
      const segments = 64;
      const circleGeometry = new THREE.CircleGeometry(radius, segments);
  
      // Create three shades of green materials
      const green1 = new THREE.MeshBasicMaterial({ color: 0x88cc44, side: THREE.DoubleSide });
      const green2 = new THREE.MeshBasicMaterial({ color: 0x66aa33, side: THREE.DoubleSide });
      const green3 = new THREE.MeshBasicMaterial({ color: 0x448822, side: THREE.DoubleSide });
  
      // Create three mesh objects with the same geometry and respective materials
      const segment1 = new THREE.Mesh(circleGeometry, green1);
      const segment2 = new THREE.Mesh(circleGeometry, green2);
      const segment3 = new THREE.Mesh(circleGeometry, green3);
  
      // Create a function to generate the segment shapes
      function createSegmentShape(startAngle, endAngle) {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.absarc(0, 0, radius, startAngle, endAngle, false);
        shape.lineTo(0, 0);
        return shape;
      }
  
      // Create segment geometries
      const segment1Geometry = new THREE.ShapeGeometry(createSegmentShape(0, (2 * Math.PI) / 3));
      const segment2Geometry = new THREE.ShapeGeometry(createSegmentShape((2 * Math.PI) / 3, (4 * Math.PI) / 3));
      const segment3Geometry = new THREE.ShapeGeometry(createSegmentShape((4 * Math.PI) / 3, 2 * Math.PI));
  
      // Update mesh objects with the new segment geometries
      segment1.geometry = segment1Geometry;
      segment2.geometry = segment2Geometry;
      segment3.geometry = segment3Geometry;
  
      // Add the mesh objects to the scene
      scene.add(segment1);
      scene.add(segment2);
      scene.add(segment3);
  
      // Render the scene
      function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      }
      animate();
  
      return () => {
        renderer.dispose();
        scene.dispose();
      };
    });
  </script>
  
  <svelte:head>
    <style>
      .container {
        width: 100%;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    </style>
  </svelte:head>
  
  <div class="container" bind:this="{container}"></div>
  