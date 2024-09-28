<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
  import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
  import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

  let container: HTMLElement;

  onMount(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(300, 300);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = false;

    camera.position.z = 5;

    // Create branch-like shape
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2, 0, 0),
      new THREE.Vector3(-1, 1, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(1, -1, 0),
      new THREE.Vector3(2, 0, 0)
    ]);

    const geometry = new THREE.TubeGeometry(curve, 100, 0.1, 8, false);
    const material = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
    const branch = new THREE.Mesh(geometry, material);
    scene.add(branch);

    // Add text
    const loader = new FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
      const textGeometry = new TextGeometry('hardwoods', {
        font: font,
        size: 0.2,
        height: 0.05,
        curveSegments: 12,
        bevelEnabled: false,
      });

      const textMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      
      // Position text along the branch
      textMesh.position.set(-1, 0.5, 0.2);
      textMesh.rotation.x = Math.PI / 2;
      scene.add(textMesh);
    });

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // Handle resize
    function onResize() {
      renderer.setSize(300, 300);
    }
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  });
</script>

<div class="toit-v3-container">
  <div bind:this={container} class="three-js-container"></div>
</div>

<style>
  .toit-v3-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .three-js-container {
    width: 300px;
    height: 300px;
  }
</style>
