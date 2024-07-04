<script>
    import { onMount, onDestroy } from 'svelte';
    import * as THREE from 'three';
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
  
    let container;
    let scene, camera, renderer, controls;
  
    onMount(() => {
      init();
      animate();
  
      return () => {
        // Cleanup on component destruction
        controls.dispose();
        renderer.dispose();
      };
    });
  
    function init() {
      // Create scene
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf0f0f0);
  
      // Create camera
      camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
      camera.position.z = 5;
  
      // Create renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);
  
      // Add orbit controls
      controls = new OrbitControls(camera, renderer.domElement);
  
      // Create a node (sphere)
      const nodeGeometry = new THREE.SphereGeometry(0.2, 32, 32);
      const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      scene.add(node);
  
      // Create a curved branch
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(1, 1, 0),
        new THREE.Vector3(2, 0, 0)
      );
  
      const points = curve.getPoints(50);
      const branchGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const branchMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
      const branch = new THREE.Line(branchGeometry, branchMaterial);
      scene.add(branch);
  
      // Handle window resize
      const handleResize = () => {
        camera.aspect = container.clißentWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };
      window.addEventListener('resize', handleResize);
  
      // Cleanup function
      onDestroy(() => {
        window.removeEventListener('resize', handleResize);
      });
    }
  
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
  </script>
  
  <div bind:this={container} style="width: 100%; height: 100%;"></div>
  
  <style>
    div {
      width: 100%;
      height: 100vh;
    }
  </style>