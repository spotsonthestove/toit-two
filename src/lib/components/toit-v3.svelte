<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
  import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
  import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
  import { CatmullRomCurve3 } from 'three/src/extras/curves/CatmullRomCurve3';

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
    controls.enableZoom = true;

    camera.position.z = 5;

    // Create branch-like shape
    const curve = new CatmullRomCurve3([
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

    // Modify the plane creation
    const planePoints = curve.getPoints(50);
    const planeGeometry = new THREE.BufferGeometry().setFromPoints(planePoints);
    const planeMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x00ff00, 
      side: THREE.DoubleSide, 
      transparent: false, 
      opacity: 0.5 
    });
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(planeMesh);

    // Modify text positioning and rotation
    const loader = new FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
      const textGeometry = new TextGeometry('hardwoods', {
        font: font,
        size: 0.2,
        height: 0.01,
        curveSegments: 12,
        bevelEnabled: false,
      });

      const textMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      
      // Center the text geometry
      textGeometry.center();

      // Create a parent object for the text
      const textParent = new THREE.Object3D();
      textParent.add(textMesh);
      scene.add(textParent);

      // Position the text along the curve
      const t = 0.5; // Position at the middle of the curve
      const position = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t);
      const normal = new THREE.Vector3(0, 1, 0); // Up vector
      const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();

      textParent.position.copy(position);
      
      // Create a rotation matrix to align with the curve
      const lookAtMatrix = new THREE.Matrix4().lookAt(
        new THREE.Vector3(0, 0, 0),
        tangent,
        normal
      );
      textParent.setRotationFromMatrix(lookAtMatrix);

      // Offset the text above the curve
      textMesh.position.y = 0.15;

      // Rotate the text to lay flat on top of the branch
      textMesh.rotation.x = -Math.PI / 2;
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
