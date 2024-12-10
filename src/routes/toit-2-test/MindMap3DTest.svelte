<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { browser } from '$app/environment';
  let THREE: typeof import('three');
  let OrbitControls: typeof import('three/examples/jsm/controls/OrbitControls').OrbitControls;
  let DragControls: typeof import('three/examples/jsm/controls/DragControls').DragControls;

  import { nodes as nodesStore, selectedNode } from '$lib/stores/mindMapTestStore';
  import type { MindMapNode } from '$lib/types/mindmap';

  const dispatch = createEventDispatcher();
  
  let container: HTMLDivElement;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let orbitControls: any;
  let dragControls: any;
  let threeNodes: THREE.Mesh[] = [];
  let branches: Array<{
    branch: THREE.Mesh;
    startNode: THREE.Mesh;
    endNode: THREE.Mesh;
    textMesh: THREE.Mesh;
  }> = [];
  let isDragging = false;
  let isInitialized = false;

  // Subscribe to store changes
  $: {
    if (scene && $nodesStore) {
      updateScene($nodesStore);
    }
  }

  async function loadDependencies() {
    THREE = await import('three');
    const OrbitControlsModule = await import('three/examples/jsm/controls/OrbitControls');
    const DragControlsModule = await import('three/examples/jsm/controls/DragControls');
    OrbitControls = OrbitControlsModule.OrbitControls;
    DragControls = DragControlsModule.DragControls;
  }

  onMount(async () => {
    if (browser) {
      await loadDependencies();
      init();
      animate();
    }
  });

  onDestroy(() => {
    if (browser) {
      cleanup();
    }
  });

  function init() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Controls setup
    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.05;

    // Drag controls will be set up after nodes are added
    setupDragControls();
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Handle window resize
    window.addEventListener('resize', handleResize);
  }

  function setupDragControls() {
    if (!camera || !renderer) return;

    if (dragControls) {
      dragControls.dispose();
    }

    dragControls = new DragControls(threeNodes, camera, renderer.domElement);

    dragControls.addEventListener('hoveron', (event) => {
      orbitControls.enabled = false;
      const mesh = event.object as THREE.Mesh;
      if (mesh.material instanceof THREE.MeshPhongMaterial) {
        mesh.material.emissive.setHex(0x666666);
      }
    });

    dragControls.addEventListener('hoveroff', (event) => {
      orbitControls.enabled = true;
      const mesh = event.object as THREE.Mesh;
      if (mesh.material instanceof THREE.MeshPhongMaterial) {
        mesh.material.emissive.setHex(0x000000);
      }
    });

    dragControls.addEventListener('dragstart', () => {
      isDragging = true;
      orbitControls.enabled = false;
    });

    dragControls.addEventListener('drag', () => {
      if (isDragging) {
        updateBranches();
      }
    });

    dragControls.addEventListener('dragend', () => {
      isDragging = false;
      orbitControls.enabled = true;
      updateNodePositions();
    });
  }

  function createNode(nodeData: MindMapNode): THREE.Mesh {
    const geometry = new THREE.SphereGeometry(nodeData.isCenter ? 0.75 : 0.5, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: nodeData.color || 0x3b82f6,
      emissive: 0x000000,
      shininess: 100
    });

    const nodeMesh = new THREE.Mesh(geometry, material);
    nodeMesh.position.set(nodeData.x || 0, nodeData.y || 0, nodeData.z || 0);
    nodeMesh.userData = { ...nodeData };

    scene.add(nodeMesh);
    threeNodes.push(nodeMesh);

    if (nodeData.parentId) {
      const parentMesh = threeNodes.find(n => n.userData.id === nodeData.parentId);
      if (parentMesh) {
        createBranch(parentMesh, nodeMesh);
      }
    }

    return nodeMesh;
  }

  function createBranch(startNode: THREE.Mesh, endNode: THREE.Mesh) {
    // Create curved line between nodes
    const points = [];
    const startPoint = startNode.position;
    const endPoint = endNode.position;
    const midPoint = new THREE.Vector3().lerpVectors(startPoint, endPoint, 0.5);
    midPoint.y += 0.5; // Add curve

    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const point = new THREE.Vector3();
      point.x = startPoint.x * (1 - t) * (1 - t) + midPoint.x * 2 * (1 - t) * t + endPoint.x * t * t;
      point.y = startPoint.y * (1 - t) * (1 - t) + midPoint.y * 2 * (1 - t) * t + endPoint.y * t * t;
      point.z = startPoint.z * (1 - t) * (1 - t) + midPoint.z * 2 * (1 - t) * t + endPoint.z * t * t;
      points.push(point);
    }

    const branchGeometry = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(points),
      20,
      0.05,
      8,
      false
    );

    const branchMaterial = new THREE.MeshPhongMaterial({
      color: 0x666666,
      transparent: true,
      opacity: 0.7
    });

    const branch = new THREE.Mesh(branchGeometry, branchMaterial);
    scene.add(branch);

    // Create text label
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 64;

    if (context) {
      context.font = '24px Arial';
      context.fillStyle = 'white';
      context.textAlign = 'center';
      context.fillText(endNode.userData.title || '', canvas.width / 2, canvas.height / 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    const textMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide
    });

    const textGeometry = new THREE.PlaneGeometry(1, 0.25);
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    const textPosition = new THREE.Vector3().lerpVectors(startPoint, endPoint, 0.5);
    textPosition.y += 0.3;
    textMesh.position.copy(textPosition);
    textMesh.lookAt(camera.position);

    scene.add(textMesh);
    branches.push({ branch, startNode, endNode, textMesh });
  }

  function updateBranches() {
    branches.forEach(({ branch, startNode, endNode, textMesh }) => {
      const points = [];
      const startPoint = startNode.position;
      const endPoint = endNode.position;
      const midPoint = new THREE.Vector3().lerpVectors(startPoint, endPoint, 0.5);
      midPoint.y += 0.5;

      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        const point = new THREE.Vector3();
        point.x = startPoint.x * (1 - t) * (1 - t) + midPoint.x * 2 * (1 - t) * t + endPoint.x * t * t;
        point.y = startPoint.y * (1 - t) * (1 - t) + midPoint.y * 2 * (1 - t) * t + endPoint.y * t * t;
        point.z = startPoint.z * (1 - t) * (1 - t) + midPoint.z * 2 * (1 - t) * t + endPoint.z * t * t;
        points.push(point);
      }

      const newGeometry = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(points),
        20,
        0.05,
        8,
        false
      );

      branch.geometry.dispose();
      branch.geometry = newGeometry;

      const textPosition = new THREE.Vector3().lerpVectors(startPoint, endPoint, 0.5);
      textPosition.y += 0.3;
      textMesh.position.copy(textPosition);
      textMesh.lookAt(camera.position);
    });
  }

  function updateNodePositions() {
    const updatedNodes = $nodesStore.map(node => {
      const threejsNode = threeNodes.find(n => n.userData.id === node.id);
      if (threejsNode) {
        return {
          ...node,
          x: threejsNode.position.x,
          y: threejsNode.position.y,
          z: threejsNode.position.z
        };
      }
      return node;
    });
    nodesStore.set(updatedNodes);
  }

  function updateScene(nodes: MindMapNode[]) {
    // Clear existing scene
    threeNodes.forEach(node => {
      scene.remove(node);
      node.geometry.dispose();
      if (node.material instanceof THREE.Material) {
        node.material.dispose();
      }
    });

    branches.forEach(({ branch, textMesh }) => {
      scene.remove(branch);
      scene.remove(textMesh);
      branch.geometry.dispose();
      if (branch.material instanceof THREE.Material) {
        branch.material.dispose();
      }
      textMesh.geometry.dispose();
      if (textMesh.material instanceof THREE.Material) {
        textMesh.material.dispose();
      }
    });

    threeNodes = [];
    branches = [];

    // Add new nodes
    nodes.forEach(nodeData => {
      createNode(nodeData);
    });

    setupDragControls();
  }

  function handleClick(event: MouseEvent) {
    if (isDragging) return;

    event.preventDefault();

    const rect = renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(threeNodes);
    
    if (intersects.length > 0) {
      const clickedNode = intersects[0].object as THREE.Mesh;
      selectedNode.set(clickedNode.userData);
      dispatch('nodeSelect', clickedNode.userData);
    } else {
      selectedNode.set(null);
    }
  }

  function handleResize() {
    if (!container || !camera || !renderer) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  function animate() {
    requestAnimationFrame(animate);
    if (orbitControls) orbitControls.update();
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  function cleanup() {
    window.removeEventListener('resize', handleResize);
    
    if (renderer) {
      renderer.domElement.removeEventListener('click', handleClick);
      renderer.dispose();
    }
    
    if (orbitControls) {
      orbitControls.dispose();
    }
    
    if (dragControls) {
      dragControls.dispose();
    }

    threeNodes.forEach(node => {
      node.geometry.dispose();
      if (node.material instanceof THREE.Material) {
        node.material.dispose();
      }
    });

    branches.forEach(({ branch, textMesh }) => {
      branch.geometry.dispose();
      if (branch.material instanceof THREE.Material) {
        branch.material.dispose();
      }
      textMesh.geometry.dispose();
      if (textMesh.material instanceof THREE.Material) {
        textMesh.material.dispose();
      }
    });
  }
</script>

<div class="canvas-container" bind:this={container}></div>

<style>
  .canvas-container {
    width: 100%;
    height: 100%;
  }
</style> 